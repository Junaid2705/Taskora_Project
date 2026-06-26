import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import JobService from '../services/jobService';
import { getCurrentUser, getRole } from '../services/auth';
import { budgetRange, timeAgo, statusPill } from '../lib/format';

const Row = ({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted small">{label}</span>
    <span className="fw-semibold small text-end">{value || '—'}</span>
  </div>
);

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser() || {};
  const isEmployer = getRole() === 'ROLE_EMPLOYER';
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    JobService.getJob(id)
      .then((r) => setJob(r.data))
      .catch(() => setErr('Job not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const onDelete = async () => {
    if (!window.confirm('Delete this job?')) return;
    try { await JobService.deleteJob(id); navigate('/my-jobs'); }
    catch { alert('Could not delete the job.'); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (err) return <div className="tk-card tk-empty"><i className="bi bi-exclamation-circle d-block mb-2"></i>{err}</div>;

  const isOwner = job.employer && job.employer.userId === user.id;
  const skills = (job.skillsRequired || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div>
      <Link to="/jobs" className="d-inline-flex align-items-center gap-1 mb-3 fw-semibold">
        <i className="bi bi-arrow-left"></i> Back to Jobs
      </Link>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="tk-card tk-card-pad">
            <div className="d-flex gap-3">
              <div className="tk-job-logo"><i className="bi bi-briefcase-fill"></i></div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <h4 className="fw-bold mb-1">{job.title}</h4>
                    <div className="text-muted">{job.employer?.fullName || job.employer?.username}</div>
                  </div>
                  <span className={`tk-pill ${statusPill(job.status)}`}>{job.status}</span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span className="tk-pill tk-pill-primary">{budgetRange(job.budget)}</span>
                  {job.location && <span className="tk-pill"><i className="bi bi-geo-alt"></i>{job.location}</span>}
                  {job.experienceRequired && <span className="tk-pill"><i className="bi bi-bar-chart"></i>{job.experienceRequired}</span>}
                </div>
                <div className="text-muted small mt-2">Posted {timeAgo(job.createdAt)}</div>
              </div>
            </div>

            <hr className="my-4" />
            <h6 className="fw-bold">Job Description</h6>
            <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{job.description || 'No description provided.'}</p>

            {skills.length > 0 && (
              <>
                <h6 className="fw-bold mt-4">Skills Required</h6>
                <div className="d-flex flex-wrap gap-2">
                  {skills.map((s) => <span key={s} className="tk-skill">{s}</span>)}
                </div>
              </>
            )}

            <h6 className="fw-bold mt-4">About Company</h6>
            <p className="text-muted mb-0">
              {job.employer?.fullName || job.employer?.username} is hiring on Taskora.
            </p>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="tk-card tk-card-pad mb-3">
            {isOwner ? (
              <div className="d-grid gap-2">
                <Link to={`/applications/job/${job.jobId}`} className="btn btn-primary">View Applications</Link>
                <button className="btn btn-outline-primary" onClick={onDelete}>Delete Job</button>
              </div>
            ) : (
              <div className="d-grid gap-2">
                {!isEmployer && job.status === 'OPEN' && (
                  <Link to={`/apply/${job.jobId}`} className="btn btn-primary">Apply Now</Link>
                )}
                <button className="btn btn-outline-primary"><i className="bi bi-bookmark me-1"></i>Save Job</button>
                <Link to={`/report?type=Job&target=${job.employer?.userId || ''}`} className="btn btn-outline-danger btn-sm mt-2">
                  <i className="bi bi-flag me-1"></i>Report this Job
                </Link>
              </div>
            )}
          </div>

          <div className="tk-card tk-card-pad">
            <h6 className="fw-bold mb-3">Job Overview</h6>
            <Row label="Experience Level" value={job.experienceRequired} />
            <Row label="Location" value={job.location} />
            <Row label="Salary Range" value={budgetRange(job.budget)} />
            <Row label="Category" value={job.category?.categoryName} />
            <Row label="Deadline" value={job.deadline} />
            <Row label="Posted On" value={job.createdAt ? new Date(job.createdAt).toLocaleDateString() : '—'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
