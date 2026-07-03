import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import Avatar from '../../components/Avatar';
import { timeAgo } from '../../lib/format';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    AdminService.getUsers(0, 200)
      .then((r) => setUsers(r.data.content || r.data))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    try { await AdminService.updateUserStatus(id, status); load(); } catch { alert('Failed to update status.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user permanently? This will remove all their data.')) return;
    try { await AdminService.deleteUser(id); load(); } catch { alert('Failed to delete user.'); }
  };

  const filteredUsers = filter === 'ALL' ? users : users.filter(u => u.status === filter);

  const statusBadge = (status) => {
    if (status === 'ACTIVE') return <span className="badge bg-success">Active</span>;
    if (status === 'BLOCKED') return <span className="badge bg-danger">Blocked</span>;
    return <span className="badge bg-warning text-dark">Inactive</span>;
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">User Management</h2>

      {/* Filter tabs */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        {['ALL', 'ACTIVE', 'INACTIVE', 'BLOCKED'].map(f => (
          <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(f)}>{f} ({f === 'ALL' ? users.length : users.filter(u => u.status === f).length})</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filteredUsers.length === 0 ? (
        <div className="tk-card tk-empty py-4 text-center"><i className="bi bi-people d-block mb-2"></i>No users found.</div>
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
              {filteredUsers.map((u) => (
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
                  <td>{statusBadge(u.status)}</td>
                  <td className="text-muted small">{timeAgo(u.createdAt)}</td>
                  <td className="text-end pe-3">
                    <div className="d-flex gap-1 justify-content-end flex-wrap">
                      {u.status === 'BLOCKED' && (
                        <button className="btn btn-sm btn-success" onClick={() => changeStatus(u.userId, 'ACTIVE')} title="Unblock">
                          <i className="bi bi-unlock"></i> Unblock
                        </button>
                      )}
                      {u.status === 'INACTIVE' && (
                        <button className="btn btn-sm btn-success" onClick={() => changeStatus(u.userId, 'ACTIVE')} title="Activate">
                          <i className="bi bi-check-circle"></i> Activate
                        </button>
                      )}
                      {u.status === 'ACTIVE' && (
                        <>
                          <button className="btn btn-sm btn-outline-warning" onClick={() => changeStatus(u.userId, 'INACTIVE')} title="Deactivate">
                            <i className="bi bi-pause-circle"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => changeStatus(u.userId, 'BLOCKED')} title="Block">
                            <i className="bi bi-lock"></i>
                          </button>
                        </>
                      )}
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u.userId)} title="Delete permanently">
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

export default AdminUsers;
