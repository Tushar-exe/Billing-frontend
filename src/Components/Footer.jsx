// src/components/Footer.jsx
import React from 'react';
import '../Custom_css/Footer.css';
const Footer = () => {
  return (
    <div className="bg-primary text-white py-3 px-3  text-center min-vh=100">
      &copy; {new Date().getFullYear()}. All rights reserved HPC-Tech.
    </div>
  );
};

export default Footer;
