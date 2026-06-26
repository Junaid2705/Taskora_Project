import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../../services/auth';
import AdminService from '../../services/adminService';
import { timeAgo } from '../../lib/format';

const API = 'http://localhost:8081/api/reports';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [msg, setMsg] = useState('');

  const loadReports = () => {
    setLoading(true);
    axios.get(API, { headers: authHeader() })
      .then((r) => setReports(r.data || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  };

  useEffect(loadReports, []);

  const resolveReport = async (id) => {
    try {
      await axios.put(`${API}/${id}/resolve`, {}, { headers: authHeader() });
      setMsg('Report resolved.');
      loadReports();
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Failed to resolve report.');
    }
  };

  const suspendUser = async (userId) => {
    if (!window.confirm('Suspend (block) this user?')) return;
    try {
      await AdminService.updateUserStatus(userId, 'BLOCKED');
      setMsg('User suspended successfully.');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Failed to suspend user.');
    }
  };

  const filtered = filter === 'ALL'
    ? reports
    : reports.filter((r) => r.status === filter);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div>
      <h2 className="tk-page-title mb-4">Reports Management</h2>

      {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}

      {/* Filter Tabs */}
      <div className="tk-tabs mb-4">
        {['ALL', 'OPEN', 'RESOLVED'].map((f) => (
          <button key={f} className={`tk-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'All' : f === 'OPEN' ? 'Open' : 'Resolved'}
            {f !== 'ALL' && <span className="badge bg-secondary ms-2">{reports.filter((r) => r.status === f).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="tk-card tk-empty py-5 text-center">
          <i className="bi bi-shield-check d-block mb-2" style={{ fontSize: '2rem' }}></i>
          <p className="mb-0 text-muted">No reports found.</p>
        </div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Reporter</th>
                <th>Target</th>
                <th>Type</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.reportId}>
                  <td className="ps-3">#{r.reportId}</td>
                  <td className="fw-semibold">{r.reportedBy?.fullName || r.reportedBy?.username || '—'}</td>
                  <td>{r.target?.fullName || r.target?.username || '—'}</td>
                  <td><span className="badge bg-info text-dark">{r.reportType || '—'}</span></td>
                  <td className="text-muted small" style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {r.reason || '—'}
                  </td>
                  <td>
                    <span className={`tk-pill ${r.status === 'OPEN' ? 'tk-pill-red' : 'tk-pill-green'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-muted small">{timeAgo(r.createdAt)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      {r.status === 'OPEN' && (
                        <button className="btn btn-sm btn-outline-success" onClick={() => resolveReport(r.reportId)} title="Resolve">
                          <i className="bi bi-check-circle"></i> Resolve
                        </button>
                      )}
                      {r.target && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => suspendUser(r.target.userId)} title="Suspend User">
                          <i className="bi bi-person-x"></i> Suspend
                        </button>
                      )}
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

export default AdminReports;
