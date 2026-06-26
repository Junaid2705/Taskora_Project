import React from 'react';
import { Link } from 'react-router-dom';
import { budgetRange, timeAgo, statusPill } from '../lib/format';

// Compact job row used in the dashboard and the jobs listing.
const JobCard = ({ job }) => {
  return (
    <Link to={`/jobs/${job.jobId}`} className="tk-card tk-job-card text-decoration-none text-dark">
      <div className="tk-job-logo"><i className="bi bi-briefcase-fill"></i></div>
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h6 className="fw-bold mb-1">{job.title}</h6>
          <span className="text-muted small text-nowrap">{timeAgo(job.createdAt)}</span>
        </div>
        <div className="text-muted small mb-2">
          {job.category?.categoryName || 'General'}
        </div>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <span className="tk-pill tk-pill-primary">{budgetRange(job.budget)}</span>
          {job.location && <span className="tk-pill"><i className="bi bi-geo-alt"></i>{job.location}</span>}
          {job.experienceRequired && <span className="tk-pill"><i className="bi bi-bar-chart"></i>{job.experienceRequired}</span>}
          {job.status && <span className={`tk-pill ${statusPill(job.status)}`}>{job.status}</span>}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
