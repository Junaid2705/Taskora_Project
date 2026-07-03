import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';

const AdminVerification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('PENDING');
  const [remarksMap, setRemarksMap] = useState({});
  const [actionLoading, setActionLoading] = useState(null);

  const load = () => {
    setLoading(true);
    const fetcher = tab === 'PENDING' ? AdminService.getVerificationsPending() : AdminService.getVerificationsAll();
    fetcher
      .then((r) => setRequests(r.data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const handleAction = async (id, action) => {
    const remarks = remarksMap[id] || '';
    setActionLoading(id);
    try {
      if (action === 'approve') {
        await AdminService.approveVerification(id, remarks);
      } else {
        await AdminService.rejectVerification(id, remarks);
      }
      setRemarksMap((prev) => { const copy = { ...prev }; delete copy[id]; return copy; });
      load();
    } catch {
      alert(`Failed to ${action} verification.`);
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status) => {
    if (status === 'APPROVED') return <span className="badge bg-success">Approved</span>;
    if (status === 'REJECTED') return <span className="badge bg-danger">Rejected</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Verification Requests</h2>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-3">
        <button className={`btn btn-sm ${tab === 'PENDING' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTab('PENDING')}>
          Pending
        </button>
        <button className={`btn btn-sm ${tab === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTab('ALL')}>
          All
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : requests.length === 0 ? (
        <div className="tk-card tk-empty py-4 text-center">
          <i className="bi bi-shield-check d-block mb-2" style={{ fontSize: '2rem' }}></i>
          No verification requests found.
        </div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">User</th>
                <th>Role</th>
                <th>Document Type</th>
                <th>Document</th>
                <th>Status</th>
                <th>Submitted</th>
                {tab === 'PENDING' && <th>Remarks</th>}
                {tab === 'PENDING' && <th className="text-end pe-3">Actions</th>}
                {tab === 'ALL' && <th>Remarks</th>}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.verificationId || r.id}>
                  <td className="ps-3">
                    <div className="fw-semibold">{r.user?.fullName || r.fullName || '—'}</div>
                    <div className="text-muted small">@{r.user?.username || r.username || '—'}</div>
                  </td>
                  <td><span className="tk-pill">{r.user?.role || r.role || '—'}</span></td>
                  <td>{r.documentType || '—'}</td>
                  <td>
                    {r.documentUrl ? (
                      <a href={r.documentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-eye me-1"></i>View
                      </a>
                    ) : '—'}
                  </td>
                  <td>{statusBadge(r.status)}</td>
                  <td className="text-muted small">
                    {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}
                  </td>
                  {tab === 'PENDING' && (
                    <>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Optional remarks..."
                          value={remarksMap[r.verificationId || r.id] || ''}
                          onChange={(e) => setRemarksMap((prev) => ({ ...prev, [r.verificationId || r.id]: e.target.value }))}
                          style={{ minWidth: 120 }}
                        />
                      </td>
                      <td className="text-end pe-3">
                        <div className="d-flex gap-1 justify-content-end">
                          <button
                            className="btn btn-sm btn-success"
                            disabled={actionLoading === (r.verificationId || r.id)}
                            onClick={() => handleAction(r.verificationId || r.id, 'approve')}
                          >
                            <i className="bi bi-check-lg me-1"></i>Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            disabled={actionLoading === (r.verificationId || r.id)}
                            onClick={() => handleAction(r.verificationId || r.id, 'reject')}
                          >
                            <i className="bi bi-x-lg me-1"></i>Reject
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                  {tab === 'ALL' && (
                    <td className="text-muted small">{r.remarks || '—'}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
