import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../../services/jobService';
import { budgetRange, timeAgo, statusPill } from '../../lib/format';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    JobService.getMyJobs().then((r) => setJobs(r.data)).catch(() => setJobs([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try { await JobService.deleteJob(id); load(); } catch { alert('Could not delete the job.'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">My Jobs</h2>
        <Link to="/post-job" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Post Job</Link>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : jobs.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-briefcase d-block mb-2"></i>You haven't posted any jobs yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {jobs.map((j) => (
            <div key={j.jobId} className="tk-card tk-card-pad">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <Link to={`/jobs/${j.jobId}`} className="fw-bold text-dark text-decoration-none">{j.title}</Link>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="tk-pill tk-pill-primary">{budgetRange(j.budget)}</span>
                    <span className={`tk-pill ${statusPill(j.status)}`}>{j.status === 'PENDING_APPROVAL' ? 'Pending Approval' : j.status}</span>
                    <span className="tk-pill"><i className="bi bi-clock"></i>{timeAgo(j.createdAt)}</span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/applications/job/${j.jobId}`} className="btn btn-sm btn-outline-primary">Applicants</Link>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onDelete(j.jobId)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
