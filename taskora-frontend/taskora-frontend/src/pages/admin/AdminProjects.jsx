import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { budgetRange, timeAgo, statusPill } from '../../lib/format';

const TABS = ['ALL', 'PENDING_APPROVAL', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];

const AdminProjects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    AdminService.getProjects(0, 100)
      .then((r) => setItems(r.data.content || r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const filtered = filter === 'ALL' ? items : items.filter((p) => p.projectStatus === filter);

  const approve = async (id) => {
    try { await AdminService.approveProject(id); load(); } catch { alert('Failed to approve.'); }
  };

  const reject = async (id) => {
    if (!window.confirm('Reject this project?')) return;
    try { await AdminService.rejectProject(id); load(); } catch { alert('Failed to reject.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await AdminService.deleteProject(id); load(); } catch { alert('Failed to delete.'); }
  };

  const statusLabel = (s) => {
    const labels = { PENDING_APPROVAL: 'Pending Approval', IN_PROGRESS: 'In Progress' };
    return labels[s] || s;
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Projects Management</h2>

      {/* Filter Tabs */}
      <ul className="nav nav-pills mb-3 gap-1 flex-wrap">
        {TABS.map((t) => (
          <li key={t} className="nav-item">
            <button
              className={`nav-link ${filter === t ? 'active' : ''}`}
              onClick={() => setFilter(t)}
            >
              {statusLabel(t)} {t !== 'ALL' && <span className="badge bg-light text-dark ms-1">{items.filter((p) => p.projectStatus === t).length}</span>}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="tk-card tk-empty text-center py-4 text-muted">No projects found.</div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">Title</th>
                <th>Owner</th>
                <th>Category</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.projectId}>
                  <td className="ps-3 fw-semibold">{p.projectTitle}</td>
                  <td className="text-muted small">{p.user?.username || '—'}</td>
                  <td className="text-muted small">{p.category?.categoryName || '—'}</td>
                  <td>{budgetRange(p.budget)}</td>
                  <td><span className={`tk-pill ${statusPill(p.projectStatus)}`}>{statusLabel(p.projectStatus)}</span></td>
                  <td className="text-muted small">{timeAgo(p.createdAt)}</td>
                  <td className="text-end pe-3">
                    <div className="d-flex gap-1 justify-content-end">
                      {p.projectStatus === 'PENDING_APPROVAL' && (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => approve(p.projectId)} title="Approve">
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => reject(p.projectId)} title="Reject">
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </>
                      )}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.projectId)} title="Delete">
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

export default AdminProjects;
