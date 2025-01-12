import React from 'react';
import './ChatWindow.css';

function ChatWindow({ question, response }) {
  return (
    <div className="chat-window">
      <div className="message">
        <strong>Question:</strong>
        <p>{question}</p>
      </div>
      <div className="message">
        <strong>Response:</strong>
        <pre>{response}</pre>
      </div>
    </div>
  );
}

export default ChatWindow;
