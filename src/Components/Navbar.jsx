import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../Custom_css/Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar-fixed border-bottom px-3 py-4 navbar navbar-dark bg-dark navbar-expand-lg">

      <div className="container-fluid">
        {/* <Link className="navbar-brand nav-link" to="/">Billing-Info</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link fs-5" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" to="/ldap/options">Ldap</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" to="/slurm/options">Slurm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5" to="/reports">Billing</Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;


