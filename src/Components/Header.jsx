// src/components/Header.jsx
import React from 'react';
import Cdac_logo from '../Assets/cdac_logo.png';// adjust the path
import proj_logo from '../Assets/proj_logo.jpg';
import '../Custom_css/Header.css'


const Header = () => {
  return (
    <div className="header-fixed w-100 bg-white shadow-sm p-2 d-flex align-items-center justify-content-between px-4 py-2 border-bottom shadow bg-white">
      {/* Left - Two Logos */}
      <div className="d-flex align-items-center">
        <img src={Cdac_logo} alt="Logo 1" height="60" className="me-2" />
        <img src={proj_logo} alt="Logo 1" height="60" className="me-2" />

      </div>

      {/* Center - Project Name */}
      {/* <div className="flex-grow-1 text-center">
        <h5 className="mb-0 fw-bold text-uppercase">UMS With Billing</h5>
      </div> */}


      {/* Right - Empty (or you can add user/profile/settings later) */}
      <div style={{ width: '80px' }}></div>
    </div>
  );
};

export default Header;
