import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import '../Custom_css/Navbar.css'
const Navbar = () => {
  return (
    <nav className="navbar-fixed border-bottom px-3 py-2 navbar navbar-light bg-primary navbar-expand-lg ">
      <div className="container-fluid">
                <button
          className="navbar-toggler ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li className="nav-item ">
              <Link className="nav-link fs-5 text-white" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 text-white" to="/ldap/options">Ldap</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 text-white" to="/slurm/options">Slurm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-5 text-white" to="/billing">Billing</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;