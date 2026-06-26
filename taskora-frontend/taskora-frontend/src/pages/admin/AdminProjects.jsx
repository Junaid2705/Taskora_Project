import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { budgetRange, timeAgo, statusPill } from '../../lib/format';

const AdminProjects = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    AdminService.getProjects(0, 100)
      .then((r) => setItems(r.data.content || r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await AdminService.deleteProject(id); load(); } catch { alert('Failed.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Projects Management</h2>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light"><tr><th className="ps-3">Title</th><th>Owner</th><th>Budget</th><th>Status</th><th>Created</th><th className="text-end pe-3">Actions</th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.projectId}>
                  <td className="ps-3 fw-semibold">{p.projectTitle}</td>
                  <td className="text-muted small">{p.user?.username || '—'}</td>
                  <td>{budgetRange(p.budget)}</td>
                  <td><span className={`tk-pill ${statusPill(p.projectStatus)}`}>{p.projectStatus}</span></td>
                  <td className="text-muted small">{timeAgo(p.createdAt)}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.projectId)}><i className="bi bi-trash"></i></button>
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
