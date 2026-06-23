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
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm border-bottom">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Brand Logo */}
        <Link
          className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center gap-2"
          to={currentUser ? "/dashboard" : "/"}
        >
          <i className="bi bi-layers-fill"></i> TASKORA
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
              <Link className="btn btn-primary fw-medium" to="/register">
                Create Account
              </Link>
            </div>
          ) : (
            // LOGGED IN VIEW
            <div className="d-flex align-items-center gap-3">
              <div className="d-none d-md-flex align-items-center gap-2 text-dark fw-medium pe-3">
                <i className="bi bi-person-circle fs-5 text-primary"></i>
                {currentUser.username} {/* Displays the dynamic username */}
              </div>
              <button
                className="btn btn-outline-danger btn-sm fw-medium"
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
