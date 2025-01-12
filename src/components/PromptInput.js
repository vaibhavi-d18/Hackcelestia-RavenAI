import React from 'react';

const PromptInput = ({ prompt, onInputChange }) => {
  return (
    <textarea
      value={prompt}
      placeholder="Enter your prompt here..."
      onChange={(e) => onInputChange(e.target.value)}
      style={{ width: '100%', height: '100px', margin: '10px 0' }}
    />
  );
};

export default PromptInput;