import React, { useState, useEffect } from "react";
import JobService from "../services/jobService";
import { Link } from "react-router-dom";
import AuthService from "../services/authService";

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = AuthService.getCurrentUser();

  useEffect(() => {
    JobService.getJobFeed().then(
      (response) => {
        setJobs(response.data);
        setIsLoading(false);
      },
      (error) => {
        setError("Failed to load the job feed.");
        setIsLoading(false);
      },
    );
  }, []);

  return (
    <div className="container py-5">
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2 className="fw-bold text-dark mb-0">Explore Open Jobs</h2>
          <p className="text-muted">
            Find your next freelance gig and start earning.
          </p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/post-job" className="btn btn-outline-primary fw-bold">
            Post a Job
          </Link>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading opportunities...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!isLoading && !error && jobs.length === 0 && (
        <div className="text-center py-5 bg-light rounded shadow-sm border">
          <i
            className="bi bi-briefcase text-muted"
            style={{ fontSize: "3rem" }}
          ></i>
          <h4 className="mt-3 text-dark">No open jobs right now</h4>
          <p className="text-muted">Check back later for new opportunities.</p>
        </div>
      )}
      {currentUser && currentUser.role === "ROLE_EMPLOYER" && (
        <div className="col-md-4 text-md-end">
          <Link to="/post-job" className="btn btn-outline-primary fw-bold">
            Post a Job
          </Link>
        </div>
      )}

      <div className="row g-4">
        {jobs.map((job) => (
          <div className="col-md-6 col-lg-4" key={job.jobId}>
            <div className="card h-100 shadow-sm border-0 d-flex flex-column">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-secondary">
                    {job.category?.categoryName}
                  </span>
                  <span className="fw-bold text-success">${job.budget}</span>
                </div>
                <h5 className="card-title fw-bold text-dark mt-3">
                  {job.title}
                </h5>
                <p className="text-muted small mb-3">
                  <i className="bi bi-building me-1"></i> Posted by{" "}
                  {job.employer?.fullName}
                </p>
                <p
                  className="card-text text-truncate"
                  style={{ maxHeight: "3em" }}
                >
                  {job.description}
                </p>
                <div className="mt-3">
                  <span className="badge bg-light text-dark border me-1">
                    <i className="bi bi-geo-alt me-1"></i>
                    {job.location}
                  </span>
                  <span className="badge bg-light text-dark border">
                    <i className="bi bi-calendar me-1"></i>Due: {job.deadline}
                  </span>
                </div>
              </div>
              <div className="card-footer bg-white border-top-0 pt-0 pb-3 mt-auto">
                <Link
                  to={`/apply/${job.jobId}`}
                  className="btn btn-primary w-100 fw-bold"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFeed;
