import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [sessionId, setSessionId] = useState('session-1');  // You can make this dynamic if needed
//sessionId=1;
  const [chatHistory, setChatHistory] = useState([]); // Declare chat history state


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
//      setResponse(JSON.stringify(data.response, null, 2));  // Pretty format the JSON response
 // Update chat history with the new response
      const newEntry = { question, response: data.new_response };
      setChatHistory((prevHistory) => [...prevHistory, newEntry]);
      setQuestion(''); // Clear the input field
    } catch (error) {
      console.error("Error generating response:", error);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <ChatWindow chatHistory={chatHistory} /> {/* Pass chatHistory to ChatWindow */}
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

