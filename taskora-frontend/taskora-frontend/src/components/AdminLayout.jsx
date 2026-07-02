import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../services/auth";
import Brand from "./Brand";
import Avatar from "./Avatar";

const links = [
  { to: "/admin", icon: "bi-grid-1x2-fill", label: "Dashboard", end: true },
  { to: "/admin/users", icon: "bi-people-fill", label: "Users" },
  { to: "/admin/jobs", icon: "bi-briefcase-fill", label: "Jobs" },
  { to: "/admin/projects", icon: "bi-folder-fill", label: "Projects" },
  { to: "/admin/posts", icon: "bi-newspaper", label: "Posts" },
  {
    to: "/admin/applications",
    icon: "bi-file-earmark-text-fill",
    label: "Applications",
  },
  { to: "/admin/subscriptions", icon: "bi-star-fill", label: "Subscriptions" },
  { to: "/admin/reports", icon: "bi-flag-fill", label: "Reports" },
  { to: "/admin/categories", icon: "bi-tag-fill", label: "Categories" },
  { to: "/admin/cms", icon: "bi-file-richtext-fill", label: "CMS Pages" },
  { to: "/admin/settings", icon: "bi-gear-fill", label: "Settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const user = getCurrentUser() || {};
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const close = () => setOpen(false);

  return (
    <div className="tk-app">
      {/* FIX APPLIED HERE: Added overflow-y-auto and maxHeight: 100vh */}
      <aside
        className={`tk-sidebar tk-sidebar-admin overflow-y-auto ${open ? "open" : ""}`}
        style={{ maxHeight: "100vh", paddingBottom: "20px" }}
      >
        <Brand />
        <div className="tk-sidebar-section">Admin Panel</div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className="tk-side-link"
            onClick={close}
          >
            <i className={`bi ${l.icon}`}></i> {l.label}
          </NavLink>
        ))}
        <div className="mt-auto pt-3">
          <button
            className="tk-side-link border-0 bg-transparent w-100 text-start"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right text-danger"></i>{" "}
            <span className="text-danger">Logout</span>
          </button>
        </div>
      </aside>

      {open && (
        <div className="tk-sidebar-backdrop d-lg-none" onClick={close}></div>
      )}

      <div className="tk-main">
        <header className="tk-topbar">
          <button
            className="tk-icon-btn d-lg-none"
            onClick={() => setOpen(true)}
            aria-label="Menu"
          >
            <i className="bi bi-list"></i>
          </button>
          <div className="ms-auto d-flex align-items-center gap-2">
            <span className="tk-icon-btn">
              <i className="bi bi-bell"></i>
            </span>
            <Avatar src={user.avatar} name={user.username} size={38} />
            <div className="d-none d-md-block lh-sm">
              <div
                className="fw-semibold text-dark"
                style={{ fontSize: "0.9rem" }}
              >
                {user.username}
              </div>
              <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                Admin
              </div>
            </div>
          </div>
        </header>
        <main className="tk-content fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
