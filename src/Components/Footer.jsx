// src/components/Footer.jsx
import React from 'react';
import '../Custom_css/Footer.css';
const Footer = () => {
  return (
<div className="footer-container">
      <footer className="footer">
        <div className="footer-content text-white">
          <div className="row">
            <div className="col-lg-4 col-md-12 mb-4">
              <h5 className="footer-title">footer content</h5>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
                molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
                voluptatem veniam, est atque cumque eum delectus sint!
              </p>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-subtitle">links</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <a href="#!" className="footer-link">Frequently Asked Questions</a>
                </li>
                <li className="mb-1">
                  <a href="#!" className="footer-link">Delivery</a>
                </li>
                <li className="mb-1">
                  <a href="#!" className="footer-link">Pricing</a>
                </li>
                <li>
                  <a href="#!" className="footer-link">Where we deliver?</a>
                </li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-subtitle">opening hours</h5>
              <table className="table footer-table">
                <tbody>
                  <tr>
                    <td>Mon - Fri:</td>
                    <td>8am - 9pm</td>
                  </tr>
                  <tr>
                    <td>Sat - Sun:</td>
                    <td>8am - 1am</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="footer-bottom text-center p-3">
          © 2020 Copyright:
          <a className="footer-credit" href="https://mdbootstrap.com/"> MDBootstrap.com</a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
