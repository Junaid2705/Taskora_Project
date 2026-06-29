import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClass = (path) => {
    const isActive = currentPath === path;
    return `nav-link px-3 py-2 d-flex align-items-center gap-3 ${
      isActive
        ? "bg-primary bg-opacity-10 text-primary fw-semibold"
        : "text-dark"
    }`;
  };

  return (
    <div
      className="bg-white border-end p-3 d-flex flex-column"
      style={{
        position: "sticky",
        top: "70px" /* Adjust this to exactly match your Navbar's height */,
        height:
          "calc(100vh - 70px)" /* Subtracts Navbar height from total screen height */,
        overflowY: "auto" /* Forces scrollbar if content is too long */,
      }}
    >
      <div className="text-muted small fw-bold text-uppercase mb-3 px-3 mt-2">
        Main Menu
      </div>

      <ul className="nav nav-pills flex-column mb-auto gap-1">
        <li className="nav-item">
          <Link to="/dashboard" className={getLinkClass("/dashboard")}>
            <i className="bi bi-grid-1x2-fill"></i> Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/feed" className={getLinkClass("/feed")}>
            <i className="bi bi-newspaper"></i> Feed
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/jobs" className={getLinkClass("/jobs")}>
            <i className="bi bi-briefcase"></i> Jobs
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/projects" className={getLinkClass("/projects")}>
            <i className="bi bi-folder2-open"></i> Projects
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/messages" className={getLinkClass("/messages")}>
            <i className="bi bi-chat-dots"></i> Messages
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/subscriptions" className={getLinkClass("/subscriptions")}>
            <i className="bi bi-star"></i> Subscriptions
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/portfolio" className={getLinkClass("/portfolio")}>
            <i className="bi bi-image"></i> Portfolio
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/applications" className={getLinkClass("/applications")}>
            <i className="bi bi-file-text"></i> Applications
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/my-bids" className={getLinkClass("/my-bids")}>
            <i className="bi bi-hammer"></i> My Bids
          </Link>
        </li>
      </ul>

      <hr className="my-3 mx-2 text-muted" />

      <div className="text-muted small fw-bold text-uppercase mb-2 px-3">
        Account
      </div>
      <ul className="nav nav-pills flex-column gap-1">
        <li className="nav-item">
          <Link to="/profile" className={getLinkClass("/profile")}>
            <i className="bi bi-person-circle"></i> Profile
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/login"
            className="nav-link px-3 py-2 d-flex align-items-center gap-3 text-danger"
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
