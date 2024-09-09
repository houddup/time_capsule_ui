import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";

export function QueryObject() {
  const [list, setList] = useState<string[]>(['0x0014105f401b34f749de210c3d4bd41a5ae70475c2ac55a7cb2cf88372f07068']);
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [objectDetails, setObjectDetails] = useState<SuiObjectData[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取用户拥有的对象
  useEffect(() => {
    const getHis = async () => {
      if (account?.address) {
        try {
          const { data} = await client.getOwnedObjects({ owner: account?.address });
          const objList: string[] = data.map((obj) => obj.data.objectId);
          setList(objList);
        } catch (error) {
          console.error("Error fetching owned objects:", error);
        }
      }
    };

    getHis();
  }, [account?.address, client]);

  // 获取对象的详细数据
  useEffect(() => {
    const fetchDataForObjects = async () => {
      try {
        const fetchedDetails = await Promise.all(
            list.map(async (id) => {
              const { data } = await client.getObject({ id, options: { showContent: true } });
              return data;
            })
        );
        setObjectDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching object details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (list.length > 0) {
      fetchDataForObjects();
    }
  }, [list, client]);

  // 用于渲染对象信息的辅助函数
  const renderObjectData = (objectData: SuiObjectData) => {
    if (objectData.content.type.endsWith('time_capsule::TimeEntry')) {
      console.log(objectData.content)
      const decodedString = objectData?.content?.fields.blobId.map(code => String.fromCharCode(code)).join('');

      return (
          <li key={objectData.objectId}>
            Object ID: {objectData.objectId}
            <br />
            BlobId: {decodedString}
            <br />
            time: {objectData?.content?.fields.timestamp}
          </li>
      );
    }
    return
  };

  // Loading 和 Error 处理
  if (loading) return <div>Loading object information...</div>;
  if (!objectDetails.length) return <div>No data found.</div>;

  return (
      <div>
        <h3>Object Details:</h3>
        <ul>
          {objectDetails.map((objectData, index) => (
              objectData && renderObjectData(objectData)
          ))}
        </ul>
      </div>
  );
}
