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
      const lines = text.split('\n'); // 将文本按行分割

      const firstLine = lines[0]; // 获取第一行内容

      // 检查第一行是否是数字（时间戳）
      if (!isNaN(Number(firstLine))) {
        const timestamp = Number(firstLine);
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString('en-GB', { // 格式化时间为 yyyy-MM-dd hh:mm:ss
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false, // 使用24小时制
        }).replace(',', ''); // 去除逗号

        lines[0] = formattedDate + ' You Say:'; // 替换第一行为格式化后的日期
      }

      const updatedText = lines.join('\n'); // 重新组合文本
      setFileContent(updatedText); // 更新文件内容

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
      <h2>Capsule Detail</h2>

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
