import React from 'react';
import './Sidebar.css';

function Sidebar({ sessions, onAddSession, onSelectSession }) {
  return (
    <div className="sidebar">
      <h2>RAVEN-AI</h2>
      <button className="createSession" onClick={onAddSession}>
        Start New Session
      </button>
      <div className="session-list">
        <ul>
          {sessions.map((session) => (
            <li
              key={session}
              className="session-item"
              onClick={() => onSelectSession(session)}
              style={{ cursor: 'pointer', padding: '5px', margin: '5px 0', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              {session}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
