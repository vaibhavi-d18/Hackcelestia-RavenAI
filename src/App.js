import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [sessions, setSessions] = useState(['session-1']);
  const [sessionId, setSessionId] = useState('session-1');
  const [generatedCode, setGeneratedCode] = useState(null);
  const [download, setDownload] = useState(null);

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleGenerateClick = async () => {
    try {
      const res = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId, question }),
      });

      const data = await res.json();
      setResponse(data.message);
      setGeneratedCode(data.response);
      setDownload(data.download_url);
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };

  const handleAddSession = () => {
    const newSessionId = `session-${sessions.length + 1}`;
    setSessions([...sessions, newSessionId]);
    setSessionId(newSessionId);
  };

  const handleSelectSession = (id) => {
    setSessionId(id);
  };

  const renderCode = (fileName, code) => (
    <div className="code-section" key={fileName}>
      <h4>{fileName}</h4>
      <pre className="code-block">{code}</pre>
    </div>
  );

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        onAddSession={handleAddSession}
        onSelectSession={handleSelectSession}
      />
      <div className="main-content">
        <h3>Active Session: {sessionId}</h3>
        <ChatWindow question={question} response={response} />
        <div className='response'>
        {/* Code Preview */}
        {generatedCode && (
          <div className="generated-code">
            {Object.keys(generatedCode).map((file) => {
              if (file !== 'instructions') {
                return (
                  <div key={file}>
                    {renderCode(file, generatedCode[file])}
                  </div>
                );
              }
              return null; // Do not render the instructions yet
            })}
  
            {/* Instructions Section */}
            {generatedCode.instructions && (
              <div className="instructions">
                <h4>Instructions</h4>
                <ul>
                  {generatedCode.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>

              </div>

             
            )}
  
  {download && (
  <div className="download-link">
    <a href={download} download className="download-button">
      📥 Download Project
    </a>
  </div>
)}


          </div>
        )}
        </div>

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