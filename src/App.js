//import React, { useState } from "react";
//import "./App.css";
//import PromptInput from "./components/PromptInput";
//import GenerateButton from "./components/GenerateButton";
//import OutputDisplay from "./components/OutputDisplay";
//import DownloadButton from "./components/DownloadButton";
//
//function App() {
//  const [prompts, setPrompts] = useState([
//    { prompt: "", projectStructure: null, loading: false, output: "", showPrompt: false },
//  ]);
//
//  const handleGenerate = async (promptIndex) => {
//    const updatedPrompts = [...prompts];
//    updatedPrompts[promptIndex].loading = true;
//    updatedPrompts[promptIndex].showPrompt = true;
//    setPrompts(updatedPrompts);
//
//    try {
//      const structure = generateProjectStructure(prompts[promptIndex].prompt);
//      updatedPrompts[promptIndex] = {
//        ...updatedPrompts[promptIndex],
//        projectStructure: structure,
//        loading: false,
//        output: "Project structure generated successfully.",
//      };
//      setPrompts(updatedPrompts);
// if (promptIndex === prompts.length - 1) {
//        setPrompts([
//          ...updatedPrompts,
//          { prompt: "", projectStructure: null, loading: false, output: "", showPrompt: false },
//        ]);
//      }
//    } catch (error) {
//      console.error("Error generating output:", error);
//      updatedPrompts[promptIndex] = {
//        ...updatedPrompts[promptIndex],
//        loading: false,
//        output: "An error occurred. Please try again.",
//      };
//      setPrompts(updatedPrompts);
//    }
//  };
//
//  const generateProjectStructure = (prompt) => {
//    if (prompt.toLowerCase().includes("java")) {
//      return {
//        BankingApp: {
//          src: { main: { java: {} } },
//          resources: {
//  "application.properties": "spring.datasource.url=jdbc:mysql://localhost:3306/banking",
//          },
//        },
//      };
//    } else if (prompt.toLowerCase().includes("react")) {
//      return {
//        "banking-app": {
//          public: { "index.html": "<!-- Basic HTML Structure -->" },
//          src: { "App.js": "function App() {...}", components: {} },
//        },
//      };
//    } else {
//      return {};
//    }
//  };
//
//  const createZip = () => {
//    return "This is the content of the ZIP file";
//  };
//
//  return (
//    <div className="App">
//      <div className="App-container">
//        {/* Side Panel */}
//        <aside className="App-sidepanel">
//
//          {/* <button>New Session</button> */}
//          <button
//    style={{
//      display: "block",
//      margin: "auto",
//  padding: "10px 20px",
//      cursor: "pointer",
//    }}
//  >
//    New Session
//  </button>
//        </aside>
//
//        {/* Main Content */}
//        <div className="App-content">
//          <h1>RavenAI Interface</h1>
//          <p>Generate content based on your prompt using RavenAI.</p>
//
//          <main className="App-main">
//            {prompts.map((entry, index) => (
//              <div key={index} style={{ marginBottom: "30px" }}>
//                {/* {entry.showPrompt && <p><strong>Prompt:</strong> {entry.prompt}</p>} */}
//                {/* {entry.showPrompt && <p><strong></strong> {entry.prompt}</p>} */}
//                {entry.showPrompt && (
//  <div
//    style={{
//      borderTop: "1px solid #ccc",
//      borderBottom: "1px solid #ccc",
//      padding: "10px 0",
//      margin: "10px 0",
//    }}
//  >
//    <p style={{ fontWeight: "bold" }}>{entry.prompt}</p>
//    {/* <p>Prompt: {entry.prompt}</p> */}
//</div>
//)}
//
//                {!entry.projectStructure && !entry.loading && (
//                  <div>
//                    <PromptInput
//                      prompt={entry.prompt}
//                      onInputChange={(value) => {
//                        const updatedPrompts = [...prompts];
//                        updatedPrompts[index].prompt = value;
//                        setPrompts(updatedPrompts);
//                      }}
//                    />
//                    <GenerateButton onClick={() => handleGenerate(index)} />
//                  </div>
//                )}
//
//                {entry.loading && <p>Loading...</p>}
//
//                {entry.projectStructure && (
//                  <OutputDisplay
//                    output={entry.output}
//   projectStructure={entry.projectStructure}
//                  />
//                )}
//
//                {entry.projectStructure && (
//                  <div>
//                    <button style={{ padding: "10px 20px", cursor: "pointer" }}>
//                      Code Preview
//                    </button>
//                    <DownloadButton fileData={createZip()} fileName="project.zip" />
//                  </div>
//                )}
//              </div>
//            ))}
//          </main>
//
//          <footer className="App-footer">
//            <p>Powered by RavenAI</p>
//          </footer>
//        </div>
//      </div>
//    </div>
//  );
//}
//
//export default App;

import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [sessionId, setSessionId] = useState('session-1');  // You can make this dynamic if needed
//sessionId=1;

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleGenerateClick = async () => {
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: "1", question }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data.response, null, 2));  // Pretty format the JSON response
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <ChatWindow question={question} response={response} />
        <div className="input-section">
          <textarea
            value={question}
            onChange={handleQuestionChange}
            placeholder="Ask a question..."
            rows="4"
          />
          <button onClick={handleGenerateClick}>Generate</button>
        </div>
      </div>
    </div>
  );
}

export default App;

