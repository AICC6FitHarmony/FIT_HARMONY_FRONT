import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsPeopleFill } from 'react-icons/bs';
import { HiMenu, HiX } from 'react-icons/hi';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    // 사이트 전체 배경
    <div className="bg-orange-50">
      {/* 로고 섹션 */}
      <div className="hidden justify-center align-center my-5 px-4  sm:flex">
        <div className="flex flex-col justify-center">
          <Link to="/">
            <div className="text-2xl md:text-3xl font-black tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
              <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Fit
              </span>
              <span className="text-[#4a902c] bg-clip-text ml-1">Harmony</span>
            </div>
            <div className="text-xs font-medium text-slate-500 tracking-wider uppercase mt-0.5 text-center md:text-left">
              Modern Fitness
            </div>
          </Link>
        </div>
      </div>

      {/* 내비게이션 바 */}
      <div className="bg-white sticky top-0 z-50 shadow-md shadow-green-800/10 rounded-2xl mx-2 md:mx-4">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* 데스크톱 메뉴들 - md 이상에서만 표시 */}
          <div className="hidden md:flex flex-1 justify-center space-x-6 text-sm font-medium text-green-700">
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
          {/* 모바일 햄버거 메뉴 버튼 - md 미만에서만 표시 */}
          <div className="md:hidden flex-1 flex justify-start">
            <button
              onClick={toggleMenu}
              className="text-green-700 hover:bg-green-100 p-2 rounded-full transition"
            >
              {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
          {/* 중앙: 타이틀 (절대 위치) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 text-xl font-extrabold text-slate-800 tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Fit
            </span>
            <span className="text-[#4a902c] ml-1">Harmony</span>
          </div>
          {/* 마이페이지 */}
          <div className="hover:bg-green-200 p-3 rounded-full transition">
            <Link to="/mypage" className="text-green-700 text-lg">
              <BsPeopleFill />
            </Link>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 rounded-b-2xl shadow-lg">
            <div className="flex flex-col space-y-2 px-4 py-4">
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="hover:bg-green-100 px-4 py-3 rounded-lg transition text-green-700 font-medium"
              >
                대쉬보드
              </Link>
              <Link
                to="/schedule"
                onClick={closeMenu}
                className="hover:bg-green-100 px-4 py-3 rounded-lg transition text-green-700 font-medium"
              >
                캘린더
              </Link>
              <Link
                to="/inbody"
                onClick={closeMenu}
                className="hover:bg-green-100 px-4 py-3 rounded-lg transition text-green-700 font-medium"
              >
                인바디
              </Link>
              <Link
                to="/community"
                onClick={closeMenu}
                className="hover:bg-green-100 px-4 py-3 rounded-lg transition text-green-700 font-medium"
              >
                커뮤니티
              </Link>
              <Link
                to="/trainer"
                onClick={closeMenu}
                className="hover:bg-green-100 px-4 py-3 rounded-lg transition text-green-700 font-medium"
              >
                강사 찾기
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
