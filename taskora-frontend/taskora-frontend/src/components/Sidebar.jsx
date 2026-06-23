import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bg-white border-end sidebar-height p-3 d-flex flex-column">
      <div className="text-muted small fw-bold text-uppercase mb-3 px-3 mt-2">Main Menu</div>
      
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        <li className="nav-item">
          <Link 
            to="/dashboard" 
            className={`nav-link px-3 py-2 d-flex align-items-center gap-3 ${currentPath === '/dashboard' ? 'bg-primary bg-opacity-10 text-primary fw-semibold' : 'text-dark'}`}
          >
            <i className="bi bi-grid-1x2-fill"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className="nav-link px-3 py-2 d-flex align-items-center gap-3 text-dark">
            <i className="bi bi-briefcase"></i> Find Jobs
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/projects" className="nav-link px-3 py-2 d-flex align-items-center gap-3 text-dark">
            <i className="bi bi-folder2-open"></i> My Projects
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/messages" className="nav-link px-3 py-2 d-flex align-items-center gap-3 text-dark">
            <i className="bi bi-chat-dots"></i> Messages
          </Link>
        </li>
        
        <hr className="my-3 mx-2 text-muted" />
        
        <div className="text-muted small fw-bold text-uppercase mb-2 px-3">Account</div>
        <li className="nav-item">
          <Link 
            to="/profile" 
            className={`nav-link px-3 py-2 d-flex align-items-center gap-3 ${currentPath === '/profile' ? 'bg-primary bg-opacity-10 text-primary fw-semibold' : 'text-dark'}`}
          >
            <i className="bi bi-person-circle"></i> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;