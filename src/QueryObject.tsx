import {useCurrentAccount, useSuiClient, useSuiClientQuery} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui.js/client";
import {useEffect, useState} from "react";

export function QueryObject() {
  // 使用useSuiClientQuery钩子来获取对象的详细信息
  const [list, setList] = useState<string[]>(['0x0014105f401b34f749de210c3d4bd41a5ae70475c2ac55a7cb2cf88372f07068']);
  const account = useCurrentAccount();

  const client = useSuiClient();

  useEffect(() => {
    const getHis = () => {
      client.getOwnedObjects({ owner: account?.address }).then((res) => {
        const objList: string[] = res.data.map((obj) => obj.data.objectId);
        setList(objList);
      });
    };

    getHis()
    // 清理函数（组件卸载时调用）
    return () => {
      console.log('Component unmounted');
      console.log(list);
    };
  }, []);


  function getData(id: string) {
    // 使用 useSuiClientQuery 获取数据
    const { data } = useSuiClientQuery('getObject', {
      id: id,
      options: {
        showContent: true,
      },
    });
    return { data };
  }


  // 用于渲染对象信息的辅助函数
  const renderObjectData = (objectData: SuiObjectData) => {
    return Object.entries(objectData).filter(([key, value]) => {
      if (value) {
        let type :string = value['data'].content.type;
        if (type.endsWith('::time_capsule::TimeEntry')) return true
      }
      return false
    }).map(([key, value], index) => (
      <li key={index}>{`${key}: ${JSON.stringify(value)}`}</li>
    ));
  };

  // 展示本次交易obeject中的内容。
  return (
    <div>
      <h3>Object Details:</h3>
      {list.map((id, index) => (
        <div key={index}>
          <h4>Object {index + 1}:</h4>
          <ul>
            {renderObjectData(getData(id))}
          </ul>
        </div>
      ))}
    </div>
  );
}
