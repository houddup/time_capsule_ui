import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text, Box } from "@radix-ui/themes";
import { OwnedObjects } from "./OwnedObjects";
import React, { useState } from "react";

export function WalletStatus({ onEncrypt }: { onEncrypt: (data: string) => void }) {
    const account = useCurrentAccount();
    const [text, setText] = useState<string>(""); // 用于存储输入框中的文本

    // 处理输入框内容的变化
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
        onEncrypt(event.target.value);
    };


    return (
      <Container my="2">
          {account ? (
            <Flex direction="column">
                {/*<Text>Wallet connected</Text>*/}
                {/*<Text>Address: {account.address}</Text>*/}

                {/* 添加一个大一点的文本输入框 */}
                <Box mt="4">
                    <label htmlFor="input-textarea">
                        <Heading mb="2">Say something to you in the future: </Heading>
                    </label>
                    <textarea
                      id="input-textarea"
                      value={text}
                      onChange={handleTextChange}
                      style={{
                          width: "100%",         // 让文本框占满宽度
                          height: "150px",        // 设置高度为150px，可以根据需要调整
                          padding: "10px",        // 给文本框内填充一些空间
                          fontSize: "16px",       // 设置字体大小
                          borderRadius: "8px",    // 添加圆角
                          border: "1px solid #ccc", // 添加边框样式
                      }}
                    />
                </Box>
            </Flex>
          ) : (
            <Text>Wallet not connected</Text>
          )}

          {/*<OwnedObjects />*/}
      </Container>
    );
}