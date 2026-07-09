import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { budgetRange, timeAgo, statusPill } from '../../lib/format';

const TABS = ['ALL', 'PENDING_APPROVAL', 'OPEN', 'CLOSED', 'REJECTED'];

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    AdminService.getJobs(0, 100)
      .then((r) => setJobs(r.data.content || r.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = filter === 'ALL' ? jobs : jobs.filter((j) => j.status === filter);

  const approve = async (id) => {
    try { await AdminService.approveJob(id); load(); } catch { alert('Failed to approve.'); }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this job?')) return;
    try { await AdminService.rejectJob(id); load(); } catch { alert('Failed to reject.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    try { await AdminService.deleteJob(id); load(); } catch { alert('Failed to delete.'); }
  };

  const statusLabel = (s) => s === 'PENDING_APPROVAL' ? 'Pending Approval' : s;

  return (
    <div>
      <h2 className="tk-page-title mb-3">Jobs Management</h2>

      {/* Filter Tabs */}
      <ul className="nav nav-pills mb-3 gap-1 flex-wrap">
        {TABS.map((t) => (
          <li key={t} className="nav-item">
            <button
              className={`nav-link ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {statusLabel(t)} {t !== 'ALL' && <span className="badge bg-light text-dark ms-1">{jobs.filter((j) => j.status === t).length}</span>}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="tk-card tk-empty text-center py-4 text-muted">No jobs found.</div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">Title</th>
                <th>Employer</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Posted</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((j) => (
                <tr key={j.jobId}>
                  <td className="ps-3 fw-semibold">{j.title}</td>
                  <td className="text-muted small">{j.employer?.username || '—'}</td>
                  <td className="text-muted small">{j.category?.categoryName || '—'}</td>
                  <td>{budgetRange(j.budget)}</td>
                  <td><span className={`tk-pill ${statusPill(j.status)}`}>{statusLabel(j.status)}</span></td>
                  <td className="text-muted small">{timeAgo(j.createdAt)}</td>
                  <td className="text-end pe-3">
                    <div className="d-flex gap-1 justify-content-end">
                      {j.status === 'PENDING_APPROVAL' && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => approve(j.jobId)} title="Approve">
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => reject(j.jobId)} title="Reject">
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </>
                      )}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(j.jobId)} title="Delete">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
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
