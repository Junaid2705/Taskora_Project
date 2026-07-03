import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import JobService from '../../services/jobService';
import Avatar from '../../components/Avatar';
import { timeAgo, statusPill, money } from '../../lib/format';

const STATUSES = ['PENDING', 'SHORTLISTED', 'HIRED', 'REJECTED'];

const ViewApplications = () => {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    JobService.getJobApplications(jobId)
      .then((r) => setApps(r.data))
      .catch(() => setErr('Could not load applications (you may not own this job).'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [jobId]);

  const changeStatus = async (id, status) => {
    try {
      await JobService.updateApplicationStatus(id, status);
      setApps((prev) => prev.map((a) => (a.applicationId === id ? { ...a, status } : a)));
    } catch { alert('Could not update status.'); }
  };

  return (
    <div>
      <Link to="/my-jobs" className="d-inline-flex align-items-center gap-1 mb-3 fw-semibold">
        <i className="bi bi-arrow-left"></i> Back to My Jobs
      </Link>
      <h2 className="tk-page-title mb-3">Applicants</h2>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : err ? (
        <div className="tk-card tk-empty"><i className="bi bi-exclamation-circle d-block mb-2"></i>{err}</div>
      ) : apps.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-people d-block mb-2"></i>No applications yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {apps.map((a) => (
            <div key={a.applicationId} className="tk-card tk-card-pad">
              <div className="d-flex gap-3">
                <Avatar src={a.freelancer?.avatar} name={a.freelancer?.fullName || a.freelancer?.username} size={48} />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div className="fw-bold">{a.freelancer?.fullName || a.freelancer?.username}</div>
                      <div className="text-muted small">Applied {timeAgo(a.appliedAt)}{a.expectedSalary ? ` · Expects ${money(a.expectedSalary)}` : ''}</div>
                    </div>
                    <span className={`tk-pill ${statusPill(a.status)}`}>{a.status}</span>
                  </div>
                  {a.coverLetter && <p className="text-muted small mt-2 mb-2" style={{ whiteSpace: 'pre-wrap' }}>{a.coverLetter}</p>}
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    {a.resumeUrl && <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary"><i className="bi bi-file-earmark-text me-1"></i>Resume</a>}
                    <select className="form-select form-select-sm w-auto" value={a.status}
                      onChange={(e) => changeStatus(a.applicationId, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;
