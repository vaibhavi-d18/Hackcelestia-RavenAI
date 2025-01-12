import React from 'react';

const GenerateButton = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: '10px 20px', cursor: 'pointer' }}>
      Generate
    </button>
  );
};

export default GenerateButton;