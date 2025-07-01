import React from 'react';
import { Link } from 'react-router-dom';
import { BsPeopleFill } from 'react-icons/bs';

const NavBar = () => {
  return (
    // 사이트 전체 배경
    <div className=" bg-orange-50">
      <div className=' flex justify-center align-center my-5'>
            {/* 로고 */}
            
            <div className="flex flex-col justify-center"><Link to="/" >
              <div className="text-3xl font-black tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
                <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Fit</span>
                <span className= "text-[#4a902c] bg-clip-text  ml-1">Harmony</span>
              </div>
              <div className="text-xs font-medium text-slate-500 tracking-wider uppercase mt-0.5">
                Modern Fitness
              </div>
              </Link>
            </div>
            </div>

      {/* 내비게이션 바 */}
      <div className="bg-white sticky top-0 z-50 shadow-md shadow-green-800/10 rounded-2xl mx-4">
        <div className="flex items-center justify-between h-16 px-6">
          {/* 메뉴들 */}
          <div className="flex-1 flex justify-center space-x-6 text-sm font-medium text-green-700">
            <Link
              to="/dashboard"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              대쉬보드
            </Link>
            <Link
              to="/schedule"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              캘린더
            </Link>
            <Link
              to="/inbody"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              인바디
            </Link>
            <Link
              to="/community"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              커뮤니티
            </Link>
            <Link
              to="/trainer"
              className="hover:bg-green-100 px-4 py-2 rounded-full transition"
            >
              강사 찾기
            </Link>
          </div>

          {/*  마이페이지 */}
          <div className="ml-auto  hover:bg-green-200 w-4 h-4 mx-3 my-3 rounded-full transition">
            <Link to="/mypage" className="text-green-700 text-sm ">
              <BsPeopleFill />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
