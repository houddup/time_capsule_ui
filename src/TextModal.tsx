import React, { useState, useEffect } from 'react';

interface TextModalProps {
  blobId: string;
  onClose: () => void; // 用于关闭弹出框
}

export const TextModal: React.FC<TextModalProps> = ({ blobId, onClose }) => {
  const [fileContent, setFileContent] = useState<string>("loading"); // 用于存储文件内容

  const getFile = async () => {
    try {
      const response = await fetch("https://aggregator-devnet.walrus.space/v1/" + blobId);

      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }

      const text = await response.text(); // 将响应解析为文本
      setFileContent(text); // 设置文件内容
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  useEffect(() => {
    getFile(); // 获取文件内容
  }, [blobId]);

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
        value={fileContent}
        style={{
          width: '50vw', // 宽度为页面宽度的50%
          height: '70vh', // 高度为页面高度的70%
          overflow: 'auto', // 如果内容太多，显示滚动条
          resize: 'none', // 禁止手动调整大小
        }}
        readOnly
      />
      <button onClick={onClose} style={{ marginTop: '10px' }}>Close</button>
    </div>
  );
};