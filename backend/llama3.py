from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import redis
import json
from enum import Enum
from groq import Groq, APIConnectionError, RateLimitError, APIStatusError
import shutil
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

# Allow CORS for requests from frontend


# Load environment variables
load_dotenv()

# Initialize Groq Client
client = Groq(api_key="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")
MODEL = "llama3-70b-8192"

# Initialize Redis Connection for Session-based History
redis_url = "redis://localhost:6379"
redis_client = redis.StrictRedis.from_url(redis_url, decode_responses=True)

# Enum for Response Format
class ResponseFormat(Enum):
    JSON = "json"
    TEXT = "text"

# Function to predict using Groq
def predict(prompt: str, system_prompt: str = None, response_format: ResponseFormat = ResponseFormat.JSON, model: str = MODEL, client: Groq = client):
    messages = [{"role": "user", "content": prompt}]
    if system_prompt:
        messages.insert(0, {"role": "system", "content": system_prompt})
    try:
        chat_completion = client.chat.completions.create(
            messages=messages,
            model=model,
            temperature=0.1,
            response_format={
                "type": "json_object" if response_format == ResponseFormat.JSON else "text"
            },
        )
        return chat_completion.choices[0].message.content
    except APIConnectionError as e:
        raise RuntimeError("The server could not be reached.") from e
    except RateLimitError as e:
        raise RuntimeError("Rate limit reached; try again later.") from e
    except APIStatusError as e:
        raise RuntimeError(f"API error: {e.message}") from e

# Function to Store Chat History in Redis
def add_to_redis(session_id, question, response):
    key = f"chat_history:{session_id}"
    chat_entry = f"Q: {question}\nA: {response}"
    redis_client.rpush(key, chat_entry)

# Retrieve Session-based Chat History
def get_relevant_context(session_id, query, k=3):
    key = f"chat_history:{session_id}"
    chat_history = redis_client.lrange(key, 0, -1)
    relevant_context = "\n".join(chat_history[-k:])
    return relevant_context

# Function to create project structure and zip it
def create_project(response, project_name="new_project"):
    base_path = os.path.join(os.getcwd(), project_name)

    # Ensure the base directory is clean
    if os.path.exists(base_path):
        shutil.rmtree(base_path)
    os.makedirs(base_path)

    try:
        for file_path, content in response.items():
            if file_path == "instructions":
                continue

            full_path = os.path.join(base_path, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            with open(full_path, "w") as file:
                file.write(content)

        # Create a zip file
        zip_path = shutil.make_archive(base_path, 'zip', base_path)
        return zip_path
    except Exception as e:
        raise RuntimeError(f"Error while creating project structure: {str(e)}")

# FastAPI Application Setup
app = FastAPI(
    title="Groq JSON API",
    version="1.0",
    description="An API Server for LLM interactions with Groq integration"
)
origins = [
    "http://localhost:3000",  # Frontend running on port 3002
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Origins that are allowed to make requests
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Request Body Models
class GenerateRequest(BaseModel):
    session_id: str
    question: str

class CreateProjectRequest(BaseModel):
    response: dict
    project_name: str

# @app.post("/generate")
# async def generate_response(request: GenerateRequest, background_tasks: BackgroundTasks):
#     try:
#         # Extract fields from the request body
#         session_id = request.session_id
#         question = request.question

#         # Retrieve relevant context for the session
#         context = get_relevant_context(session_id, question, k=3)

#         # Define system and user prompts
#         system_prompt = """
#         You are an AI development assistant. Your task is to generate complete project code based on user prompts. You must always return the output response in JSON format, where: Each file is represented as a key with its name (e.g., app.js, README.md). The value of each file is the properly formatted and indented code or content for that file. Include a key instructions with a value as a list of step-by-step instructions to run the generated project. Ensure the output JSON is properly formatted and can be parsed by downstream systems.
#         """
#         prompt = f"Context:\n{context}\n\nQuestion:\n{question}"

#         # Use Groq predict for response
#         response = predict(prompt, system_prompt, response_format=ResponseFormat.JSON)
#         parsed_response = json.loads(response)

#         # Save interaction to session-based chat history
#         add_to_redis(session_id, question, response)

#         # Call the create-project endpoint in the background
#         background_tasks.add_task(create_project, parsed_response, project_name="generated_project")

#         return {"message": "Response generated successfully", "response": parsed_response}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
@app.post("/generate")
async def generate_response(request: GenerateRequest):
    try:
        # Extract fields from the request body
        session_id = request.session_id
        question = request.question

        # Retrieve relevant context for the session
        context = get_relevant_context(session_id, question, k=3)

        # Define system and user prompts
        system_prompt = """
        You are an AI development assistant. Your task is to generate complete project code based on user prompts. You must always return the output response in JSON format, where: Each file is represented as a key with its name (e.g., app.js, README.md). The value of each file is the properly formatted and indented code or content for that file. Include a key instructions with a value as a list of step-by-step instructions to run the generated project. Ensure the output JSON is properly formatted and can be parsed by downstream systems.
        """
        prompt = f"Context:\n{context}\n\nQuestion:\n{question}"

        # Use Groq predict for response
        response = predict(prompt, system_prompt, response_format=ResponseFormat.JSON)
        parsed_response = json.loads(response)

        # Save interaction to session-based chat history
        add_to_redis(session_id, question, response)

        # Create project structure and zip file
        zip_file_path = create_project(parsed_response, project_name="new_project")

        # Return the parsed response and download link for the zip file
        download_url = f"http://localhost:5000/download/{os.path.basename(zip_file_path)}"
        return {
            "message": "Response generated successfully",
            "response": parsed_response,
            "download_url": download_url,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{file_name}")
async def download_file(file_name: str):
    file_path = os.path.join(os.getcwd(), file_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="application/zip", filename=file_name)


@app.post("/create-project")
async def create_project_endpoint(request: CreateProjectRequest):
    try:
        # Create project structure and zip it
        zip_file_path = create_project(request.response, project_name=request.project_name)
        
        # Return the zip file as a downloadable response
        return FileResponse(
            zip_file_path,
            media_type="application/zip",
            filename=f"{request.project_name}.zip",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for running the server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=5000)
