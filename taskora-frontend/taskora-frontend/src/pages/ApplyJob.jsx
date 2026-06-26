import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobService from '../services/jobService';
import { budgetRange } from '../lib/format';

const ApplyJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ coverLetter: '', expectedSalary: '', resumeUrl: '' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    JobService.getJob(jobId).then((r) => setJob(r.data)).catch(() => {});
  }, [jobId]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setOk(''); setLoading(true);
    try {
      await JobService.applyForJob({
        jobId: Number(jobId),
        coverLetter: form.coverLetter,
        expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : null,
        resumeUrl: form.resumeUrl,
      });
      setOk('Application submitted! Redirecting...');
      setTimeout(() => navigate('/my-applications'), 1400);
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Could not submit your application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Apply for Job</h2>
      <div className="tk-card tk-card-pad" style={{ maxWidth: 720 }}>
        {job && (
          <div className="mb-3 pb-3 border-bottom">
            <h5 className="fw-bold mb-1">{job.title}</h5>
            <span className="tk-pill tk-pill-primary">{budgetRange(job.budget)}</span>
          </div>
        )}
        {err && <div className="alert alert-danger py-2 small">{err}</div>}
        {ok && <div className="alert alert-success py-2 small">{ok}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Cover Letter</label>
            <textarea name="coverLetter" rows="6" className="form-control" placeholder="Tell the employer why you're a great fit..."
              value={form.coverLetter} onChange={onChange} required />
          </div>
          <div className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Expected Salary ($)</label>
              <input type="number" name="expectedSalary" className="form-control" value={form.expectedSalary} onChange={onChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Resume URL</label>
              <input name="resumeUrl" className="form-control" placeholder="https://..." value={form.resumeUrl} onChange={onChange} />
            </div>
          </div>
          <button className="btn btn-primary px-4" disabled={loading}>{loading ? 'Submitting...' : 'Submit Application'}</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
