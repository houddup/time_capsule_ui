import { useCurrentAccount, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui.js/client";
import { useEffect, useState } from "react";
import openImg from "../src/img/open.png"
import closeImg from "../src/img/close.png"

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
      const decodedString = objectData?.content?.fields.blobId.map(code => String.fromCharCode(code)).join('');
      const timestamp = Date.now();

      let img = timestamp < objectData?.content?.fields.timestamp ? closeImg : openImg;

      // 在 openImg 的情况下，允许点击触发操作
      const isOpen = img === openImg;
      return (
        <img src={img}
             alt={decodedString}
             style={{ width: '100px', height: 'auto', cursor: isOpen ? 'pointer' : 'default' }}
             onClick={isOpen ? () => handleClick(decodedString) : undefined}
             title={isOpen ? "Click to open" : "Not time yet"}  // 仅在 openImg 状态下触发点击事件/>
        />
      )
    }
    return
  };
  
  const renderObjectDataAll = (objectDataList: SuiObjectData[]) => {
    return (
      <ul style={{display: 'flex', listStyleType: 'none', padding: 0, alignItems: 'flex-end'}}>
        {objectDataList.map((objectData, index) => {
          const renderedData = renderObjectData(objectData);
          // 只有当 renderObjectData 返回有效内容时才渲染 <li>
          return renderedData ? (
            <li key={objectData.objectId || index} style={{margin: '0 20px'}}>
              {renderedData}
            </li>
          ) : null;
        })}
      </ul>
    );
  };

  // 点击处理函数
  const handleClick = (decodedString: string) => {
    console.log("Image clicked:", decodedString);
    // 这里可以添加点击后的操作逻辑
  };

  // Loading 和 Error 处理
  if (loading) return <div>Loading object information...</div>;
  if (!objectDetails.length) return <div>No data found.</div>;

  return (
    <div>
      <h3>Object Details:</h3>
      {renderObjectDataAll(objectDetails)}
    </div>
  );
}
