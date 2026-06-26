import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { timeAgo, statusPill, money } from '../../lib/format';

const STATUSES = ['PENDING', 'SHORTLISTED', 'HIRED', 'REJECTED'];

const AdminApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    AdminService.getApplications(0, 100)
      .then((r) => setApps(r.data.content || r.data || []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    try {
      await AdminService.updateApplicationStatus(id, status);
      setMsg('Status updated.'); load();
      setTimeout(() => setMsg(''), 2500);
    } catch { setMsg('Failed.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try { await AdminService.deleteApplication(id); load(); } catch { setMsg('Failed.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Applications Management</h2>
      <p className="text-muted small mb-3">View and manage all job applications across the platform.</p>

      {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : apps.length === 0 ? (
        <div className="tk-card tk-empty py-5"><i className="bi bi-file-earmark-text d-block mb-2" style={{ fontSize: '2rem' }}></i>No applications found.</div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Job Title</th>
                <th>Applicant</th>
                <th>Expected Salary</th>
                <th>Status</th>
                <th>Applied</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => (
                <tr key={a.applicationId}>
                  <td className="ps-3">#{a.applicationId}</td>
                  <td className="fw-semibold">{a.job?.title || '—'}</td>
                  <td>{a.freelancer?.fullName || a.freelancer?.username || '—'}</td>
                  <td>{a.expectedSalary ? money(a.expectedSalary) : '—'}</td>
                  <td>
                    <select className="form-select form-select-sm w-auto" value={a.status}
                      onChange={(e) => changeStatus(a.applicationId, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-muted small">{timeAgo(a.appliedAt)}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(a.applicationId)}>
                      <i className="bi bi-trash"></i>
                    </button>
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

export default AdminApplications;
