import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../services/jobService';
import { timeAgo, statusPill, money } from '../lib/format';

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    JobService.getMyApplications().then((r) => setApps(r.data)).catch(() => setApps([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2 className="tk-page-title mb-3">My Applications</h2>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : apps.length === 0 ? (
        <div className="tk-card tk-empty">
          <i className="bi bi-file-earmark-text d-block mb-2"></i>
          You haven't applied to any jobs yet.
          <div className="mt-3"><Link to="/jobs" className="btn btn-primary btn-sm">Browse Jobs</Link></div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {apps.map((a) => (
            <div key={a.applicationId} className="tk-card tk-card-pad d-flex justify-content-between align-items-center gap-3">
              <div>
                <Link to={`/jobs/${a.job?.jobId}`} className="fw-bold text-dark text-decoration-none">
                  {a.job?.title || 'Job'}
                </Link>
                <div className="text-muted small mt-1">
                  Applied {timeAgo(a.appliedAt)} {a.expectedSalary ? `· Expected ${money(a.expectedSalary)}` : ''}
                </div>
              </div>
              <span className={`tk-pill ${statusPill(a.status)}`}>{a.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
