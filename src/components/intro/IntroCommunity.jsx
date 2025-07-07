import React, { useEffect, useState } from "react";

const IntroCommunity = ({getHotData, getLatestData}) => {
  const [hotData , setHotData] = useState();
  const [latestData , setLatestData] = useState();
  useEffect(()=>{
    setHotData(getHotData);
    setLatestData(getLatestData);
  },[getHotData,getLatestData])

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">인기 게시글</h2>
          {hotData && hotData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <a href={`/community/post/${item.postId}`} className="flex-1 flex items-center">
                  <span>{item.title}</span>
                  <span className="ml-2 text-gray-400 text-sm">{`[${item.commentCount}]`}</span>
                </a>
              </div>
          ))}
          <button className="text-sm text-[#8e8e8e]">
            <a href="/community">더보기</a>
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">최근 게시글</h2>
          {latestData && latestData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <a href={`/community/post/${item.postId}`} className="flex-1 flex items-center">
                  <span>{item.title}</span>
                  <span className="ml-2 text-gray-400 text-sm">{`[${item.commentCount}]`}</span>
                </a>
              </div>
          ))}
          <button className="text-sm text-[#8e8e8e]">
            <a href="/community">더보기</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroCommunity;
