import React from 'react';

const DownloadButton = ({ fileData, fileName }) => {
  const handleDownload = () => {
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} style={{ padding: '10px 20px', cursor: 'pointer' }}>
      Download
    </button>
  );
};

export default DownloadButton;