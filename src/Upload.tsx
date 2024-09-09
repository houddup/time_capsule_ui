import { useSuiClient, useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { useState } from 'react';
import { Transaction, TransactionObjectArgument } from '@mysten/sui/transactions';


const Upload = () => {
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
      {currentAccount ? (
        <>
          <div>
            <button
              onClick={() => {
                const tx = new Transaction();
                tx.build()
                const argument1: TransactionObjectArgument = tx.object(
                  '0xa7927708a2f4d2f4fb30d4fbcef47d494d4c18a74b51417d9578e12d6b7f7331'
                );
                const argument2 = tx.pure.u64(12132);
                const argument3 = tx.pure.string('_DUJvv594AgQqY2GAJPYFZ_HB0r96Dni6omp3o6ZclU');

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
                      setDigest(digest + '\n' + result.digest); // 保存交易的 digest

                      // fetchTransactionEffects(digest)
                    },
                    onError: (error) => {
                      console.error('Transaction failed:', error);
                    },
                  }
                );
              }}
            >
              upload
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

export default Upload;