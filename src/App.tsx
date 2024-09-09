import {ConnectButton, useCurrentAccount, useSuiClient} from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import React, {useEffect, useState} from "react";
import DatePicker from "react-datepicker"; // 引入日期选择器
import "react-datepicker/dist/react-datepicker.css"; // 引入样式
import FileFetcher from "./FileFetcher";
import Trans from "./Trans";
import Upload from "./Upload";
import { QueryObject } from "./QueryObject";



function App() {
  const [uploadStatus, setUploadStatus] = useState<string>(""); // 上传状态
  const [isLoading, setIsLoading] = useState<boolean>(false); // 按钮加载状态

  // 获取当前日期
  const currentDate = new Date();
  const oneMonthLater = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); // 设置一个月后的日期
  const [selectedDate, setSelectedDate] = useState<Date | null>(oneMonthLater); // 默认日期

  const [textData, setTextData] = useState<string>(""); // 存储从子组件传回的加密数据
  const account = useCurrentAccount();

  // 处理子组件返回的加密数据
  const handleEncryptedData = (data: string) => {
    setTextData(data);
    console.log(textData);
    console.log(selectedDate?.toDateString() + "\n" + "123");
  };

  // 处理文件上传
  const handleUpload = async () => {
    setIsLoading(true); // 设置加载状态
    const timestamp = Date.now();
    try {
      const response = await fetch("https://publisher-devnet.walrus.space/v1/store", {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain", // 根据文件类型设置合适的 Content-Type
        },
        body: timestamp + "\n" + textData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus("File uploaded successfully!");
        console.log("Upload successful:", result);
        let blobId = "";
        if (result.alreadyCertified) {
          blobId = result.alreadyCertified.blobId;
        }
        if (result.newlyCreated) {
          blobId = result.newlyCreated.blobObject.blobId;
        }
        console.log("blobId:", blobId);
      } else {
        setUploadStatus("File upload failed.");
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      setUploadStatus("Error during file upload.");
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false); // 无论成功或失败都结束加载状态
    }
  };

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>time capsule</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>

      <Container>
        <Container mt="5" pt="2" px="4" style={{ background: "var(--gray-a2)", minHeight: 500 }}>
          <WalletStatus onEncrypt={handleEncryptedData} />

          {/* 日期选择器 */}
          <div style={{ marginTop: "20px" }}>
            <h3>Select a Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)} // 更新选择的日期
              minDate={new Date()} // 从今天开始选择
              dateFormat="yyyy-MM-dd" // 设置日期格式
              placeholderText="Select a date"
            />
          </div>

          {/* 文件上传功能 */}
          <div style={{ marginTop: "20px" }}>
            <div>
              <button onClick={handleUpload} disabled={isLoading}>
                {isLoading ? "Uploading..." : "Upload File"}
              </button>
            </div>
            {/* 显示上传状态 */}
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>

          <div>
            <h1>Welcome to the File Fetcher</h1>
            <FileFetcher /> {/* 使用 FileFetcher 组件 */}
            <Trans /> {/* 使用 FileFetcher 组件 */}
            <Upload/>
            <QueryObject />
          </div>
        </Container>
      </Container>
    </>
  );
}

export default App;