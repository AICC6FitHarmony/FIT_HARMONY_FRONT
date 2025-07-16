import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const IntroCommunity = ({ getHotData, getLatestData }) => {
  const [hotData, setHotData] = useState();
  const [latestData, setLatestData] = useState();
  useEffect(() => {
    setHotData(getHotData);
    setLatestData(getLatestData);
  }, [getHotData, getLatestData]);

  return (
    <div className="mt-10">
      <div className="sm:flex gap-4">


        <div className="space-y-2 p-2 sm:w-1/2">
          <h2 className="flex justify-between text-lg font-semibold mb-2 border-b-2 pb-1">
            <span>인기 게시글</span>
            <button className="text-sm text-[#8e8e8e]">
            <a href="/community">더보기</a>
          </button>
          </h2>
          <ul className="p-2">
            {hotData &&
              hotData.map((item, idx) => (
                <li key={idx} className="mb-1.5 w-full list-disc ml-[15px]">
                  <a href={`/community/post/${item.postId}`} className="flex items-center w-full">
                    <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]">{item.title}</div>
                    <div className="ml-2 text-gray-400 text-sm">{`[${item.commentCount}]`}</div>
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className="space-y-2 p-2 sm:w-1/2">
          <h2 className="flex justify-between text-lg font-semibold mb-2 border-b-2 pb-1">
            <span>최근 게시글</span>
            <button className="text-sm text-[#8e8e8e]">
              <a href="/community">더보기</a>
            </button>
          </h2>
          <ul className="p-2">
          {latestData &&
            latestData.map((item, idx) => (
              <li key={idx} className="mb-1.5 w-full list-disc ml-[15px]">
                <Link to={`/community/post/${item.postId}`} className="flex items-center">
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]">{item.title}</div>
                  <div className="ml-2 text-gray-400 text-sm">{`[${item.commentCount}]`}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntroCommunity;
