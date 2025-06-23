import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const NavBar = () => {
  return (
    // logo

    <div className='container'>
      <div className='flex justify-center items-center h-20'>
        <span className='text-2xl font-bold'>Fit Harmony</span>
        </div>
    
    <div className="  bg-green-50 sticky top-0 z-50 px-10 shadow-lg shadow-green-800/10">
      <div className=" ">
        <div className="flex justify-between items-center h-20 ">
        
          <ul className='flex justify-between items-center w-full'>
            <li className='text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium'>
              <Link to="/dashboard">대쉬보드</Link>
            </li>
            <li className='text-green-700 hover:bg-green-200 px-4 py-4 rounded-full transition font-medium'>
              <Link to="/schedule">
                <CalendarDays />
                캘린더
              </Link>
            </li >
            <li className='text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium'>
              <Link to="/inbody">인바디</Link>
            </li>
            <li className='text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium'>
              <Link to="/community">커뮤니티</Link>
            </li>
            <li className='text-green-700 hover:bg-green-200 rounded-full px-4 py-4 transition font-medium'>
              <Link to="/trainer">강사 찾기</Link>
            </li>
          </ul>
        </div>
        </div>
        </div>
    </div>
  );
};

export default NavBar;







