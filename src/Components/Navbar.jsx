import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Custom_css/Navbar.css'
import { useAuth } from '../AuthContext';
import Cdac_logo from '../Assets/cdac_logo.png';// adjust the path
import proj_logo from '../Assets/proj_logo.jpg';
const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-fixed border-bottom p-2 navbar navbar-light bg-primary navbar-expand-lg ">
      <div className="container-fluid ">
        <div className="d-flex align-items-center">
        <img src={Cdac_logo} alt="Logo 1" height="60" className="me-2" />
        <img src={proj_logo} alt="Logo 1" height="60" className="me-2" />

      </div>
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
        <div className="collapse navbar-collapse justify-content-center position-relative" id="navbarNavDropdown">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item ms-5">
              <Link className="nav-link fs-3  mx-2 text-white" to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-3  mx-2 text-white" to="/ldap/options">Ldap</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-3  mx-2 text-white" to="/slurm/options">Slurm</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fs-3  mx-2 text-white" to="/billing">Billing</Link>
            </li>
          </ul>

          {isAuthenticated && (
            <button className="btn btn-danger ms-auto" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};
export default Navbar;