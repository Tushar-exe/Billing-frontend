
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../Custom_css/Sidebar.css';

const Sidebar = () => {
  const [open, setOpen] = useState(null);

  const toggle = (section) => {
    setOpen(open === section ? null : section);
  };

  return (
    <div className="custom-sidebar ">
        <div className="menu-section">
        <NavLink to="/home"style={{ textDecoration: "none", color: "inherit" }}>
            <div className="menu-title">
                 <i className="bi bi-person-vcard-fill me-1"></i> HOME
            </div>
        </NavLink>
        </div>
        <div className="menu-section">
        <NavLink to="/quick-setup"style={{ textDecoration: "none", color: "inherit" }}>
            <div className="menu-title">
                 <i className="bi bi-person-vcard-fill me-1"></i> QUICK SETUP
            </div>
        </NavLink>
        </div>
      
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggle('ldap')}>
          <i className="bi bi-person-vcard-fill me-1"></i> LDAP
          <i className={`bi ms-auto ${open === 'ldap' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </div>
        {open === 'ldap' && (
          <div className="submenu">
            <NavLink to="/ldap/user-ldiff" className="submenu-item">User.ldiff</NavLink>
            <NavLink to="/ldap/group-ldiff" className="submenu-item">Groups.ldiff</NavLink>
            <NavLink to="/ldap/uid/logs" className="submenu-item">User uid Log</NavLink>
            <NavLink to="/ldap/gid/logs" className="submenu-item">User guid Log</NavLink>
            <NavLink to="/ldap/logs" className="submenu-item">Slapd Logs</NavLink>

          </div>
        )}
      </div>

      <div className="menu-section">
        <div className="menu-title" onClick={() => toggle('slurm')}>
          <i className="bi bi-hdd-network-fill me-1"></i> SLURM
          <i className={`bi ms-auto ${open === 'slurm' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </div>
        {open === 'slurm' && (
          <div className="submenu">
            <NavLink to="/slurm/slurmdbd-log" className="submenu-item">Slurmdbd<br/> Logs</NavLink>
            <NavLink to="/slurm/slurmctld-log" className="submenu-item">Slurmctld<br/> Logs</NavLink>
            {/* <NavLink to="/slurm/info" className="submenu-item">Sinfo</NavLink>
            <NavLink to="/slurm/partition" className="submenu-item">Partition Names</NavLink> */}
          </div>
        )}
      </div>
      <div className="menu-section">
        <div className="menu-title" onClick={() => toggle('reports')}>
          <i className="bi bi-graph-up-arrow me-1"></i> BILLING
          <i className={`bi ms-auto ${open === 'reports' ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
        </div>
        {open === 'reports' && (
          <div className="submenu">
            <NavLink
              to="/billing"
              className={({ isActive }) =>
                `submenu-item${isActive ? ' active' : ''}`
              }
            >
              Billing Reports
            </NavLink>
          </div>
        )}
      </div>

{/* 
      <div>
        <NavLink to="/logout" className="menu-item logout">
          <i className="bi bi-box-arrow-right"></i> Logout
        </NavLink>
      </div> */}
    </div>
  );
};

export default Sidebar;


