import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';

const Trainer = () => {
  return (
    <div>
      <div></div>

      <div>
        <h2>강사찾기</h2>
      </div>
      <div className="searc flex relative justify-betweenh">
        <div className="">
          <input
            type="text"
            placeholder="검색어를 입력해 주세요"
            className="border-2 border-[#e0e0e0] rounded-md py-2 px-70 align-center"
          />
        </div>
        <div className="absolute right-0 w-full h-full ">
          <button>
            <IoSearchOutline />
          </button>
        </div>
      </div>
      <div className="nav"></div>
      <div className="check"></div>
      <div className="under"></div>
    </div>
  );
};

export default Trainer;
