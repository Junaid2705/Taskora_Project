import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { budgetRange, timeAgo, statusPill } from '../../lib/format';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    AdminService.getJobs(0, 100)
      .then((r) => setJobs(r.data.content || r.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try { await AdminService.deleteJob(id); load(); } catch { alert('Failed.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Jobs Management</h2>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light"><tr><th className="ps-3">Title</th><th>Employer</th><th>Budget</th><th>Status</th><th>Posted</th><th className="text-end pe-3">Actions</th></tr></thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.jobId}>
                  <td className="ps-3 fw-semibold">{j.title}</td>
                  <td className="text-muted small">{j.employer?.username || '—'}</td>
                  <td>{budgetRange(j.budget)}</td>
                  <td><span className={`tk-pill ${statusPill(j.status)}`}>{j.status}</span></td>
                  <td className="text-muted small">{timeAgo(j.createdAt)}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(j.jobId)}><i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
