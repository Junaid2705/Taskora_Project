import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminService from '../../services/adminService';
import Avatar from '../../components/Avatar';
import { timeAgo } from '../../lib/format';

const StatCard = ({ icon, bg, color, value, label }) => (
  <div className="col-6 col-lg-3">
    <div className="tk-card tk-card-pad h-100">
      <div className="d-flex align-items-center gap-3">
        <div className="tk-stat-icon" style={{ background: bg, color }}><i className={`bi ${icon}`}></i></div>
        <div>
          <div className="fs-4 fw-bold lh-1">{value ?? '—'}</div>
          <div className="text-muted small">{label}</div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AdminService.getStats().then((r) => setStats(r.data)),
      AdminService.getUsers(0, 5).then((r) => setUsers(r.data.content || r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div>
      <h2 className="tk-page-title mb-4">Dashboard</h2>

      <div className="row g-3 mb-4">
        <StatCard icon="bi-people-fill" bg="#e8f0fe" color="#2563eb" value={stats.totalUsers} label="Total Users" />
        <StatCard icon="bi-briefcase-fill" bg="#fff1e6" color="#ea580c" value={stats.totalJobs} label="Total Jobs" />
        <StatCard icon="bi-folder-fill" bg="#e7f7ee" color="#16a34a" value={stats.totalProjects} label="Total Projects" />
        <StatCard icon="bi-star-fill" bg="#f3e8ff" color="#9333ea" value={stats.activeSubscriptions} label="Active Subscriptions" />
        <StatCard icon="bi-currency-dollar" bg="#fef3c7" color="#d97706" value={stats.revenue ? '$' + Number(stats.revenue).toLocaleString() : '$0'} label="Total Earnings" />
      </div>

      <div className="tk-card tk-card-pad">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Recent Users</h6>
          <Link to="/admin/users" className="small fw-semibold">View All</Link>
        </div>
        {users.length === 0 ? (
          <p className="text-muted small mb-0">No users yet.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {users.map((u) => (
              <div key={u.userId} className="d-flex align-items-center gap-3">
                <Avatar src={u.avatarUrl} name={u.fullName || u.username} size={42} />
                <div className="flex-grow-1 min-w-0">
                  <div className="fw-semibold text-truncate">{u.fullName || u.username}</div>
                  <div className="text-muted small text-truncate">{u.email}</div>
                </div>
                <span className="text-muted small text-nowrap">{timeAgo(u.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
