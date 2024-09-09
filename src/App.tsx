import {ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient} from '@mysten/dapp-kit';
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { WalletStatus } from "./WalletStatus";
import {useState} from "react";
import DatePicker from "react-datepicker"; // 引入日期选择器
import "react-datepicker/dist/react-datepicker.css"; // 引入样式
import { QueryObject } from "./QueryObject";
import { Transaction, TransactionObjectArgument } from '@mysten/sui/transactions';
import capsuleImg from '../src/img/capsule.png'


function App() {
  const [uploadStatus, setUploadStatus] = useState<string>(""); // 上传状态
  const [isLoading, setIsLoading] = useState<boolean>(false); // 按钮加载状态
  const client = useSuiClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          // Select additional data to return
          showObjectChanges: true,
        },
      }),
  });

  // 获取当前日期
  const currentDate = new Date();
  const oneMonthLater = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); // 设置一个月后的日期
  const [selectedDate, setSelectedDate] = useState<Date | null>(oneMonthLater); // 默认日期

  const [textData, setTextData] = useState<string>(""); // 存储从子组件传回的加密数据
  const account = useCurrentAccount();

  // 处理子组件返回的加密数据
  const handleEncryptedData = (data: string) => {
    setTextData(data);
  };

  // 处理文件上传
  const handleUpload = async () => {
    if (!account) {
      window.alert("Please log in to your wallet first."); // 弹出消息提示
      return; // 直接返回，停止执行
    }
    if (!textData) {
      window.alert("Please say something."); // 弹出消息提示
      return; // 直接返回，停止执行
    }
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
        setUploadStatus("Add capsule successfully!");
        console.log("Upload successful:", result);
        let blobId = "";
        if (result.alreadyCertified) {
          blobId = result.alreadyCertified.blobId;
        }
        if (result.newlyCreated) {
          blobId = result.newlyCreated.blobObject.blobId;
        }
        console.log("blobId:", blobId);
        const tx = new Transaction();
        tx.build()
        const argument1: TransactionObjectArgument = tx.object(
          '0xa7927708a2f4d2f4fb30d4fbcef47d494d4c18a74b51417d9578e12d6b7f7331'
        );
        const argument2 = tx.pure.u64(selectedDate?.getTime());
        const argument3 = tx.pure.string(blobId);

        // 构建一个合约调用
        tx.moveCall({
          target:
            '0xa055bf5745c0bcd3dc46602f6f2823ec84514abad9205b93ffe31e5b0dd44e2f::time_capsule::store_time_entry', // 替换为实际的合约函数路径
          arguments: [argument1, argument2, argument3], // 传递对象参数
        });

        // 使用 signAndExecuteTransaction 来执行交易
        signAndExecuteTransaction(
          {
            transaction: tx,
            chain: 'sui:testnet', // 你可以根据需要更改网络，比如 'sui:testnet'
          },
          {
            onSuccess: (result) => {
              console.log('Executed transaction:', result);
              console.log('Executed tx:', tx);
            },
            onError: (error) => {
              console.error('Transaction failed:', error);
            },
          }
        );
      } else {
        setUploadStatus("Add capsule failed.");
        console.error("Upload failed:", response.statusText);
      }
    } catch (error) {
      setUploadStatus("Error during add capsule.");
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
          borderBottom: "2px solid rgba(0, 0, 0, 0.1)", // Slightly darker bottom border
          backgroundColor: "#f6f6f6", // Light beige/gray background
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Add shadow for depth
        }}
      >
        <Box style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <img
            src={capsuleImg}
            alt="Time Capsule Icon"
            style={{ width: "50px", height: "auto", marginRight: "10px" }} // Adjust image size and spacing
          />
          <Heading
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px", // Ensure enough height for heading
            }}
          >
            Time Capsule
          </Heading>
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
            <h3>Select a Open Date</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)} // 更新选择的日期
              minDate={new Date()} // 从今天开始选择
              dateFormat="yyyy-MM-dd" // 设置日期格式
              placeholderText="Select a open date"
            />
          </div>

          {/* 文件上传功能 */}
          <div style={{ marginTop: "20px" }}>
            <div>
              <button
                style={{
                  backgroundColor: '#ff4d4f',   // 设置按钮背景颜色为红色
                  color: 'white',               // 按钮文字颜色为白色
                  padding: '8px 16px',          // 内边距控制按钮大小
                  borderRadius: '4px',          // 设置圆角
                  border: 'none',               // 去除边框
                  fontSize: '14px',             // 设置字体大小
                  fontWeight: 'bold',           // 字体加粗
                  cursor: 'pointer',            // 鼠标悬停时显示手型
                }}
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Capsule"}
              </button>

            </div>
            {/* 显示上传状态 */}
            {uploadStatus && <p>{uploadStatus}</p>}
          </div>

          <div>
            <QueryObject/>
          </div>
        </Container>
      </Container>
    </>
  );
}

export default App;