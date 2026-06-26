import React from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';
import { isLoggedIn } from '../services/auth';

// Public top navbar used on the landing page.
const Navbar = () => {
  const loggedIn = isLoggedIn();
  return (
    <nav className="tk-navbar sticky-top">
      <div className="container d-flex align-items-center py-2">
        <Brand />
        <ul className="nav d-none d-lg-flex mx-auto gap-1">
          <li className="nav-item"><a className="nav-link text-dark fw-medium" href="#features">Find Work</a></li>
          <li className="nav-item"><a className="nav-link text-dark fw-medium" href="#features">Find Talent</a></li>
          <li className="nav-item"><a className="nav-link text-dark fw-medium" href="#features">How it Works</a></li>
          <li className="nav-item"><a className="nav-link text-dark fw-medium" href="#features">Resources</a></li>
        </ul>
        <div className="ms-auto d-flex align-items-center gap-2">
          {loggedIn ? (
            <Link to="/dashboard" className="btn btn-primary px-3">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-link text-dark fw-semibold text-decoration-none">Log In</Link>
              <Link to="/register" className="btn btn-primary px-3">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
