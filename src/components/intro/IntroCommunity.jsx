import React from "react";

const IntroCommunity = () => {
  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">커뮤니티</h2>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-4 h-4 border rounded mr-2" />
              <span>게시글 제목</span>
            </div>
          ))}
          <button className="text-sm text-[#8e8e8e]">
            <a href="/community">더보기</a>
          </button>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-2">공지사항</h2>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-4 h-4 border rounded mr-2" />
              <span>게시글 제목</span>
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
