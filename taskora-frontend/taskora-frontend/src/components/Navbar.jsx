import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);

  // Check if a user is logged in when the Navbar loads
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/"); // Send them back to the landing page
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm border-bottom py-2">
      <div className="container d-flex justify-content-between align-items-center">
        
        {/* --- Brand Logo (Image Only) --- */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to={currentUser ? "/dashboard" : "/"}
        >
          <img 
            src="/logo.png" 
            alt="Taskora Logo" 
            height="45" /* Increased height since text is gone */
            style={{ objectFit: "contain", cursor: "pointer" }}
            className="brand-logo-hover" 
          />
        </Link>

        {/* Right Side Navigation & Auth Controls */}
        <div className="d-flex align-items-center gap-3">
          {!currentUser ? (
            // LOGGED OUT VIEW
            <div className="d-flex align-items-center gap-2">
              <Link
                className="nav-link text-dark fw-medium px-3 d-none d-sm-block"
                to="/login"
              >
                Login
              </Link>
              <Link className="btn btn-primary fw-medium px-4 rounded-pill" to="/register">
                Create Account
              </Link>
            </div>
          ) : (
            // LOGGED IN VIEW
            // LOGGED IN VIEW
          <div className="d-flex align-items-center gap-3">
            
            {/* Clean User Profile Indicator */}
            <div className="d-none d-md-flex align-items-center gap-2 text-dark fw-bold pe-2">
              <i className="bi bi-person-circle fs-5 text-primary"></i>
              {currentUser.fullName || currentUser.username}
            </div>

            <button
              className="btn btn-outline-danger btn-sm fw-bold px-3 rounded-pill"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;