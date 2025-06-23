import React from 'react';
import NavBar from './NavBar';

const Header = () => {
  return (
    <div className="header-wrapper">
      <div className="flex items-center justify-cente">
        <div>logo</div>
      </div>
      <NavBar />
    </div>
  );
};

export default Header;
