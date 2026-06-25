import React, { useState, useEffect } from "react";
import JobService from "../services/jobService";
import AuthService from "../services/authService";
import { Link } from "react-router-dom";

const JobFeed = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Grab the currently logged-in user to check their role
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
    <div className="container py-5 fade-in">
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2 className="fw-bold text-dark mb-0">Explore Open Jobs</h2>
          <p className="text-muted">
            Find your next freelance gig and start earning.
          </p>
        </div>

        {/* FIX #3: ONLY EMPLOYERS CAN SEE THE POST JOB BUTTON */}
        {currentUser && currentUser.role === "ROLE_EMPLOYER" && (
          <div className="col-md-4 text-md-end">
            <Link
              to="/post-job"
              className="btn btn-primary fw-bold px-4 rounded-pill shadow-sm"
            >
              <i className="bi bi-plus-lg me-2"></i>Post a Job
            </Link>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      )}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row g-4">
        {jobs.map((job) => (
          <div className="col-md-6 col-lg-4" key={job.jobId}>
            <div className="card h-100 border-0 shadow-sm d-flex flex-column hover-lift">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                    {job.category?.categoryName}
                  </span>
                  <span className="fw-bold text-success fs-5">
                    ${job.budget}
                  </span>
                </div>
                <h5 className="card-title fw-bold text-dark mt-3">
                  {job.title}
                </h5>
                <p className="text-muted small mb-3">
                  <i className="bi bi-person-circle me-1"></i> Posted by{" "}
                  {job.employer?.fullName}
                </p>
                <p
                  className="card-text text-muted"
                  style={{ maxHeight: "3em", overflow: "hidden" }}
                >
                  {job.description}
                </p>
              </div>
              <div className="card-footer bg-white border-0 pt-0 pb-4 px-4 mt-auto">
                {/* FIX #3: ONLY FREELANCERS CAN APPLY */}
                {currentUser && currentUser.role === "ROLE_FREELANCER" ? (
                  <Link
                    to={`/apply/${job.jobId}`}
                    className="btn btn-primary w-100 fw-bold rounded-pill shadow-sm"
                  >
                    Apply Now
                  </Link>
                ) : (
                  <button
                    className="btn btn-light w-100 fw-bold rounded-pill text-muted"
                    disabled
                  >
                    View Only
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobFeed;
