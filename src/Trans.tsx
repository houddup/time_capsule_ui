import { ConnectButton, useSuiClient, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useState } from 'react';
import { Transaction, TransactionObjectArgument } from '@mysten/sui/transactions';


const Trans = () => {
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
  const [digest, setDigest] = useState('');
  const currentAccount = useCurrentAccount();
  // 初始化 Sui 客户端，用于获取交易效果
  const client = useSuiClient();


  return (
    <div style={{ padding: 20 }}>
      <ConnectButton />
      {currentAccount ? (
        <>
          <div>
            <button
              onClick={() => {
                const tx = new Transaction();
                tx.build()
                const argument: TransactionObjectArgument = tx.object(
                  '0xdc0f573f2015e71c0244bd992da7987e67adc59a640aeb0d7721644a1298f86b'
                );

                // 构建一个合约调用
                tx.moveCall({
                  target:
                    '0xa055bf5745c0bcd3dc46602f6f2823ec84514abad9205b93ffe31e5b0dd44e2f::time_capsule::get_time_entries', // 替换为实际的合约函数路径
                  arguments: [argument], // 传递对象参数
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
                      console.log('Executed transaction:', tx);
                    },
                    onError: (error) => {
                      console.error('Transaction failed:', error);
                    },
                  }
                );
              }}
            >
              Sign and execute transaction
            </button>
          </div>

          {/* 显示 Digest */}
          {digest && <div>Digest: {digest}</div>}
        </>
      ) : (
        <div>Please connect your wallet first.</div>
      )}
    </div>
  );
};

export default Trans;