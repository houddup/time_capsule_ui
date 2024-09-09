// FileFetcher.tsx
import { useState } from "react";

const FileFetcher = () => {
  const [fileContent, setFileContent] = useState<string>(""); // 用于存储文件内容
  const [downloadStatus, setDownloadStatus] = useState<string>("");

  // 处理文件下载并解析文本
  const handleDownload = async () => {
    setDownloadStatus("Fetching file content...");
    try {
      const response = await fetch("https://aggregator-devnet.walrus.space/v1/_DUJvv594AgQqY2GAJPYFZ_HB0r96Dni6omp3o6ZclU");

      if (!response.ok) {
        throw new Error("Failed to fetch file content");
      }

      const text = await response.text(); // 将响应解析为文本

      setFileContent(text); // 设置文件内容
      setDownloadStatus("File content fetched successfully!");
    } catch (error) {
      setDownloadStatus("Failed to fetch file content.");
      console.error("Error fetching file:", error);
    }
  };

  return (
    <div>
      <button onClick={handleDownload}>Fetch File Content</button>
      <p>{downloadStatus}</p>

      {/* 显示下载的文件内容 */}
      {fileContent && (
        <div>
          <h3>File Content:</h3>
          <pre>{fileContent}</pre> {/* 使用 <pre> 标签保留格式 */}
        </div>
      )}
    </div>
  );
};

export default FileFetcher;