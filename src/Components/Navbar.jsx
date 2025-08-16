import React, { useRef, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../Custom_css/Navbar.css'
import { useAuth } from '../AuthContext';
import Cdac_logo from '../Assets/cdac_logo.png';// adjust the path
import proj_logo from '../Assets/proj_logo.jpg';
import logo from '../Assets/logo.png'; // Assuming you have a logo image
import logo_gen from '../Assets/logo_gen.png'; // Assuming you have a logo image
import userIcon from '../Assets/userIcon.png'; // Assuming you have a user icon image    
const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Selected Menu
  const isSlurmActivated = location.pathname.startsWith("/slurm");
  const isHomeActivated = location.pathname.startsWith("/home");
  const isLdapActivated = location.pathname.startsWith("/ldap");
  const isBillingActivated = location.pathname.startsWith("/billing");
  const isQuickSetupActivated = location.pathname.startsWith("/quick-setup");
  const menuRef = useRef(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleLogin = () => {
    navigate('/login');
  }


  const mouseEnterHandler = (e) => {
    const link = e.currentTarget.querySelector(".dropdown-toggle");
    const menu = e.currentTarget.querySelector(".dropdown-menu");
    link.classList.add("show");
    menu.classList.add("show");
  };

  const mouseLeaveHandler = (e) => {
    const link = e.currentTarget.querySelector(".dropdown-toggle");
    const menu = e.currentTarget.querySelector(".dropdown-menu");
    link.classList.remove("show");
    menu.classList.remove("show");
  };

  return (
    <nav className="navbar-fixed border-bottom p-2 navbar navbar-light navbar-expand-lg " style={{ backgroundColor: 'rgb(20, 130, 214)' }}>
      <div className="d-flex justify-content-between align-items-center w-100" style={{ overflow: 'visible' }}>
        <div className="">
          <img src={Cdac_logo} alt="Logo 1" height="60" className="" />
          <img src={logo_gen} alt="Logo 1" height="70" className="me-2" />
        </div>

        <div className="collapse navbar-collapse justify-content-center position-relative" id="navbarNavDropdown">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className={`nav-link fs-5 fw-bold mx-2 text-white ${isHomeActivated ? "selected-menu" : ""}`} to="/home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link fs-5 fw-bold mx-2 text-white ${isQuickSetupActivated ? "selected-menu" : ""}`} to="/quick-setup">Quick Setup</Link>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={(e) => mouseEnterHandler(e)}
              onMouseLeave={(e) => mouseLeaveHandler(e)}
            >
              <Link
                className={`nav-link fs-5 fw-bold mx-2 text-white dropdown-toggle ${isLdapActivated ? "selected-menu" : ""}`}
                to='/ldap/options'
                id="ldapDrodown"
                role="button"
              >
                Ldap
              </Link>
              <ul className="dropdown-menu" aria-labelledby="ldapDrodown">
                <li>
                  <Link className="dropdown-item" to="/ldap">Ldap Form</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/ldap/user-ldiff">User.ldif</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/ldap/group-ldiff">Group.ldif</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/ldap/users">Ldap User</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/ldap/uid/logs">Uid Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/ldap/gid/logs">Gid Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/ldap/logs">Ldap Logs</Link>
                </li>

              </ul>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={(e) => mouseEnterHandler(e)}
              onMouseLeave={(e) => mouseLeaveHandler(e)}
            >
              <Link
                className={`nav-link fs-5 fw-bold mx-2 text-white dropdown-toggle ${isSlurmActivated ? "selected-menu" : ""}`}
                to='/slurm/options'
                id="slurmDropdown"
                role="button"
              >
                Slurm
              </Link>
              <ul className="dropdown-menu" aria-labelledby="slurmDropdown">
                <li>
                  <Link className="dropdown-item" to="/slurm/users_list">Users Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/slurm/accounts">Account Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/slurm/associations">Association Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/slurm/qos">Qos Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/slurm/slurmdbd-log">slurmdbd-log Details</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/slurm/slurmctld-log">slurmctld-log Details</Link>
                </li>
              </ul>
            </li>
            <li
              className="nav-item dropdown"
              onMouseEnter={(e) => mouseEnterHandler(e)}
              onMouseLeave={(e) => mouseLeaveHandler(e)}
            >
              <Link
                className={`nav-link fs-5 fw-bold mx-2 text-white dropdown-toggle ${isBillingActivated ? "selected-menu" : ""}`}
                to='/billing'
                id="navbarDropdown"
                role="button"
              >
                Billing
              </Link>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/billing">Generate User Bill</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item" to="/billing/recharge">Recharge User</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div className='ms-5 me-4'>
          <div class="dropdown bg-white rounded-circle p-1 ms-3">
            <a class="" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img
                src={userIcon}
                alt="User"
                width="50"
                height="50"
                className="rounded-circle"
                style={{ cursor: 'pointer' }}
                onClick={() => setMenuOpen(!menuOpen)}
              />
            </a>

            <ul class="dropdown-menu user-dropdown">
              {
                !isAuthenticated && <li><a class="dropdown-item" onClick={handleLogin}>Login</a></li>
              }
              {
                isAuthenticated && <li><a class="dropdown-item" onClick={handleLogout}>Logout</a></li>
              }
            </ul>
          </div>
        </div>
      </div>

    </nav>
  );
};
export default Navbar;