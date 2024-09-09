import React from 'react';

interface TextModalProps {
  blobId: string;
  onClose: () => void; // 用于关闭弹出框
}

export const TextModal: React.FC<TextModalProps> = ({ blobId, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2>Blob ID Information</h2>
      <textarea
        defaultValue={blobId}
        style={{ width: '100%', height: '100px' }}
        readOnly
      />
      <button onClick={onClose} style={{ marginTop: '10px' }}>Close</button>
    </div>
  );
};