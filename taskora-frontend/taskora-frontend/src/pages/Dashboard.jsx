import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../services/jobService';
import BidService from '../services/bidService';
import MessageService from '../services/messageService';
import { getCurrentUser, getRole } from '../services/auth';
import JobCard from '../components/JobCard';

const StatCard = ({ icon, bg, color, value, label }) => (
  <div className="col-12 col-md-4">
    <div className="tk-card tk-card-pad d-flex align-items-center gap-3 h-100">
      <div className="tk-stat-icon" style={{ background: bg, color }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div className="fs-3 fw-bold lh-1">{value}</div>
        <div className="text-muted small">{label}</div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const user = getCurrentUser() || {};
  const isEmployer = getRole() === 'ROLE_EMPLOYER';
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ a: 0, b: 0, m: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tasks = [
      JobService.getJobFeed().then((r) => setJobs(r.data.slice(0, 5))).catch(() => {}),
    ];
    const a = isEmployer ? JobService.getMyJobs() : JobService.getMyApplications();
    Promise.all([
      a.then((r) => r.data.length).catch(() => 0),
      BidService.getMyBids().then((r) => r.data.length).catch(() => 0),
      MessageService.getContacts().then((r) => r.data.length).catch(() => 0),
    ]).then(([x, y, z]) => setStats({ a: x, b: y, m: z }));
    Promise.all(tasks).finally(() => setLoading(false));
  }, [isEmployer]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="tk-page-title">Hello, {user.username} 👋</h2>
        <p className="text-muted mb-0">Welcome back to Taskora</p>
      </div>

      <div className="row g-3 mb-4">
        <StatCard icon={isEmployer ? 'bi-briefcase-fill' : 'bi-send-fill'} bg="#e8f0fe" color="#2563eb"
          value={stats.a} label={isEmployer ? 'Jobs Posted' : 'Jobs Applied'} />
        <StatCard icon="bi-hammer" bg="#fff1e6" color="#ea580c" value={stats.b} label="Projects Bidding" />
        <StatCard icon="bi-chat-dots-fill" bg="#e7f7ee" color="#16a34a" value={stats.m} label="Messages" />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Recommended for You</h5>
        <Link to="/jobs" className="fw-semibold small">View All</Link>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : jobs.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-inbox d-block mb-2"></i>No open jobs yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {jobs.map((j) => <JobCard key={j.jobId} job={j} />)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
