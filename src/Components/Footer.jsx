// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <div className="bg-primary text-white py-3 px-4 mt-auto text-center">
      &copy; {new Date().getFullYear()}. All rights reserved.
    </div>
  );
};

export default Footer;
