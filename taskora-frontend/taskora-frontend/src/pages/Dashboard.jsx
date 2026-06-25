import React from "react";
import { Link } from "react-router-dom";
import AuthService from "../services/authService";

const Dashboard = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="fade-in">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-2 border-bottom">
        <div className="mb-3 mb-md-0">
          <h2 className="fw-bold mb-1 text-dark">Dashboard Overview</h2>
          <p className="text-muted mb-0">
            Welcome back,{" "}
            <span className="text-primary fw-bold">
              {currentUser?.fullName || currentUser?.username}
            </span>
            ! Here is what's happening today.
          </p>
        </div>

        {/* Action Button */}
        {currentUser?.role === "ROLE_EMPLOYER" ? (
          <Link
            to="/post-job"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-plus-lg"></i> Post a Job
          </Link>
        ) : (
          <Link
            to="/jobs"
            className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-search"></i> Find Jobs
          </Link>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 border-0 p-3 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-3">
                <i className="bi bi-send-fill fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 fw-semibold">Active Bids</h6>
                <h3 className="fw-bold mb-0 text-dark">12</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 p-3 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle me-3">
                <i className="bi bi-check-circle-fill fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 fw-semibold">
                  Completed Projects
                </h6>
                <h3 className="fw-bold mb-0 text-dark">8</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 p-3 shadow-sm">
            <div className="card-body d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle me-3">
                <i className="bi bi-envelope-fill fs-4"></i>
              </div>
              <div>
                <h6 className="text-muted mb-1 fw-semibold">Unread Messages</h6>
                <h3 className="fw-bold mb-0 text-dark">4</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed Placeholder */}
      <h5 className="fw-bold mb-3 text-dark">Recent Activity</h5>
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center p-5 text-muted bg-white rounded">
          <i className="bi bi-activity fs-1 text-light mb-3 d-block"></i>
          Your live job and project feed will load here once connected to the
          backend.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
