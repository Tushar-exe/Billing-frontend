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
              <h5 className="footer-title">Contact Us</h5>
              <p>
                CDAC Innovation Park, 34/B/1, Panchawati Rd, Mansarovar, Panchawati, Pashan, Pune, Maharashtra 411008
              </p>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              <h5 className="footer-subtitle">links</h5>
              <ul className="list-unstyled mb-0">
                <li className="mb-1">
                  <a href="/ldap/options" className="footer-link">LDAP</a>
                </li>
                <li className="mb-1">
                  <a href="/slurm/options" className="footer-link">SLURM</a>
                </li>
                <li className="mb-1">
                  <a href="/billing" className="footer-link">BILLING</a>
                </li>
                
              </ul>
            </div>

            <div className="col-lg-4 col-md-6 mb-4">
              {/* <h5 className="footer-subtitle">opening hours</h5>
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
              </table> */}
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.8636497904054!2d73.80812467372081!3d18.535062768734285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf40bef092f1%3A0x48c508ccaa4ef9a!2sCentre%20for%20Development%20of%20Advanced%20Computing%20(C-DAC)!5e0!3m2!1sen!2sin!4v1754548247878!5m2!1sen!2sin" style={{height:"150px",width:'400px'}}></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom text-center p-3">
          © 2020 Copyright:
          <a className="footer-credit" href=""> CDAC,PUNE </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
