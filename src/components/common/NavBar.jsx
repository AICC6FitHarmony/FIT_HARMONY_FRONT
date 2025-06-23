import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';

const NavBar = () => {
  return (
    <div className=" box-border shadow-2xl shadow-green-500">
      <div className="a">
        <div className="nav_wrap">
          <ul>
            <li>
              <Link to="/dashboard">1</Link>
            </li>
            <li>
              <Link to="/schedule">
                <CalendarDays />
                캘린더
              </Link>
            </li>
            <li>
              <Link to="/inbody">인바디</Link>
            </li>
            <li>
              <Link to="/community">커뮤니티</Link>
            </li>
            <li>
              <Link to="/trainer">강사 찾기</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
