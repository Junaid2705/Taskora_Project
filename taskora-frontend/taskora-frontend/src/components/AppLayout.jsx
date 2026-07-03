import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, getRole, logout } from "../services/auth";
import Brand from "./Brand";
import Avatar from "./Avatar";

const AppLayout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const user = getCurrentUser() || {};
  const role = getRole();
  const isEmployer = role === "ROLE_EMPLOYER";
  const isCreator = role === "ROLE_CREATOR";
  const isFreelancer = role === "ROLE_FREELANCER";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (search.trim())
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setOpen(false);
  };

  const close = () => setOpen(false);

  const sideLink = (to, icon, label) => (
    <NavLink
      to={to}
      className="tk-side-link"
      onClick={close}
      end={to === "/dashboard"}
    >
      <i className={`bi ${icon}`}></i> {label}
    </NavLink>
  );

  // Role-based accent colors and labels
  const sidebarConfig = isCreator
    ? { accent: "#9333ea", label: "Creator Studio", dot: "🟣" }
    : isEmployer
    ? { accent: "#ea580c", label: "Employer Hub", dot: "🟠" }
    : { accent: "#2563eb", label: "Freelancer Hub", dot: "🔵" };

  return (
    <div className="tk-app">
      {/* ---------- Sidebar ---------- */}
      <aside
        className={`tk-sidebar overflow-y-auto ${open ? "open" : ""}`}
        style={{ maxHeight: "100vh", paddingBottom: "20px" }}
      >
        <Brand />
        <div className="tk-sidebar-section" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span>{sidebarConfig.dot}</span> {sidebarConfig.label}
        </div>
        {sideLink("/dashboard", "bi-grid-1x2-fill", "Dashboard")}
        {sideLink("/feed", "bi-newspaper", "Feed")}
        {!isCreator && sideLink("/jobs", "bi-briefcase-fill", "Jobs")}
        {!isCreator && sideLink("/projects", "bi-folder-fill", "Projects")}
        {sideLink("/messages", "bi-chat-dots-fill", "Messages")}
        {!isEmployer && sideLink("/subscriptions", "bi-star-fill", "Subscriptions")}
        {isFreelancer && sideLink("/my-portfolio", "bi-images", "Portfolio")}
        {isEmployer && sideLink("/my-jobs", "bi-file-earmark-text-fill", "My Jobs")}
        {isEmployer && sideLink("/post-job", "bi-plus-circle-fill", "Post Job")}
        {isEmployer && sideLink("/post-project", "bi-plus-square-fill", "Post Project")}
        {isFreelancer && sideLink("/my-applications", "bi-file-earmark-text-fill", "Applications")}
        {isFreelancer && sideLink("/my-bids", "bi-hammer", "My Bids")}

        <div className="tk-sidebar-section">Account</div>
        {sideLink("/profile", "bi-person-circle", "Profile")}
        {sideLink("/report", "bi-flag", "Report")}
        {role === "ROLE_ADMIN" &&
          sideLink("/admin", "bi-shield-lock-fill", "Admin Panel")}

        <button
          className="tk-side-link border-0 bg-transparent w-100 text-start"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right text-danger"></i>{" "}
          <span className="text-danger">Logout</span>
        </button>

        <div className="mt-auto small text-muted px-2 pt-4">Taskora v1.0</div>
      </aside>

      {open && (
        <div className="tk-sidebar-backdrop d-lg-none" onClick={close}></div>
      )}

      {/* ---------- Main ---------- */}
      <div className="tk-main">
        <header className="tk-topbar">
          <button
            className="tk-icon-btn d-lg-none"
            onClick={() => setOpen(true)}
            aria-label="Menu"
          >
            <i className="bi bi-list"></i>
          </button>
          <form className="tk-search d-none d-sm-block" onSubmit={submitSearch}>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                className="form-control"
                placeholder="Search jobs, projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </form>
          <div className="ms-auto d-flex align-items-center gap-2">
            <Link to="/messages" className="tk-icon-btn">
              <i className="bi bi-chat-dots"></i>
            </Link>
            <Link to="/notifications" className="tk-icon-btn">
              <i className="bi bi-bell"></i>
              <span className="tk-dot"></span>
            </Link>
            <Link
              to="/profile"
              className="d-flex align-items-center gap-2 text-decoration-none ms-1"
            >
              <Avatar src={user.avatar} name={user.username} size={38} />
              <div className="d-none d-md-block lh-sm">
                <div
                  className="fw-semibold text-dark"
                  style={{ fontSize: "0.9rem" }}
                >
                  {user.username}
                </div>
                <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                  {(role || "").replace("ROLE_", "")}
                </div>
              </div>
            </Link>
          </div>
        </header>

        <main className="tk-content fade-in">
          <Outlet />
        </main>
      </div>

      {/* ---------- Mobile bottom nav ---------- */}
      <nav className="tk-bottom-nav">
        <NavLink to="/dashboard" className="tk-bottom-link" end>
          <i className="bi bi-house-door-fill"></i>Home
        </NavLink>
        <NavLink to="/jobs" className="tk-bottom-link">
          <i className="bi bi-briefcase-fill"></i>Jobs
        </NavLink>
        <NavLink to="/projects" className="tk-bottom-link">
          <i className="bi bi-folder-fill"></i>Projects
        </NavLink>
        <NavLink to="/messages" className="tk-bottom-link">
          <i className="bi bi-chat-dots-fill"></i>Messages
        </NavLink>
        <NavLink to="/profile" className="tk-bottom-link">
          <i className="bi bi-person-fill"></i>Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default AppLayout;
