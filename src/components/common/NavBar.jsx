import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div className="container m-auto">
      {/* // logo // */}
      <div className="header items-center h-20">
        <div className="flex justify-center  items-center h-20">
          <span className="text-2xl font-bold">
            <Link to="/">Fit Harmony</Link>
          </span>
        </div>
      </div>
      {/* nav bar */}
      <div className="HW-nav  bg-green-50 sticky m-auto top-0 z-50 shadow-lg shadow-green-800/10">
        <div className="flex justify-between items-center h-20 ">
          <ul className="flex justify-between items-center w-full m-10">
            <li className="text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium">
              <Link to="/dashboard">대쉬보드</Link>
            </li>
            <li className="text-green-700 hover:bg-green-200 px-4 py-4 rounded-full transition font-medium">
              <Link to="/schedule">캘린더</Link>
            </li>

            <li className="text-green-700 hover:bg-green-200 rounded-full px-[10px] py-[10px] transition font-medium">
              <Link to="/inbody">인바디</Link>
            </li>
            <li className="text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium">
              <Link to="/community">커뮤니티</Link>
            </li>
            <li className="text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium">
              <Link to="/trainer">강사 찾기</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
