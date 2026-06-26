import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import Avatar from '../../components/Avatar';
import { timeAgo, statusPill } from '../../lib/format';

const STATUSES = ['ACTIVE', 'INACTIVE', 'BLOCKED'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    AdminService.getUsers(0, 100)
      .then((r) => setUsers(r.data.content || r.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    try { await AdminService.updateUserStatus(id, status); load(); } catch { alert('Failed to update status.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try { await AdminService.deleteUser(id); load(); } catch { alert('Failed to delete user.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">User Management</h2>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.userId}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center gap-2">
                      <Avatar src={u.avatarUrl} name={u.fullName || u.username} size={36} />
                      <div>
                        <div className="fw-semibold">{u.fullName || u.username}</div>
                        <div className="text-muted small">@{u.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-muted small">{u.email}</td>
                  <td><span className="tk-pill">{u.role}</span></td>
                  <td>
                    <select className="form-select form-select-sm w-auto" value={u.status}
                      onChange={(e) => changeStatus(u.userId, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="text-muted small">{timeAgo(u.createdAt)}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u.userId)}>
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

export default AdminUsers;
