import React from 'react';

const OutputDisplay = ({ output, projectStructure }) => {
  const renderProjectStructure = (structure) => {

if (!structure) return null;

   const renderFolder = (folder, level = 0) => {
  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      {Object.keys(folder).map((key) => {
        if (typeof folder[key] === 'string') {
          return <div key={key}>{key}</div>;
        } else {
          return (
            <div key={key}>
              <strong>{key}</strong>
              {renderFolder(folder[key], level + 1)}
            </div>
          );
        }
      })}
    </div>
  );
};


    return <div>{renderFolder(structure)}</div>;
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
      <h3>{output}</h3>
      {projectStructure && renderProjectStructure(projectStructure)}
    </div>
  );
};

export default OutputDisplay;