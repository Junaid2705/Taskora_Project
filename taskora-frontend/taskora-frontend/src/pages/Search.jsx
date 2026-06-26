import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import JobService from '../services/jobService';
import ProjectService from '../services/projectService';
import MessageService from '../services/messageService';
import Avatar from '../components/Avatar';
import { budgetRange, timeAgo } from '../lib/format';

const Search = () => {
  const [params] = useSearchParams();
  const q = params.get('q') || '';
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q.trim()) return;
    setLoading(true);
    Promise.all([
      MessageService.searchUsers(q).then((r) => setUsers(r.data)).catch(() => setUsers([])),
      JobService.searchJobs({ keyword: q }).then((r) => setJobs(r.data)).catch(() => setJobs([])),
      ProjectService.search({ keyword: q }).then((r) => setProjects(r.data)).catch(() => setProjects([])),
    ]).finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <h2 className="tk-page-title mb-1">Search Results</h2>
      <p className="text-muted mb-3">Showing results for "<strong>{q}</strong>"</p>

      <div className="tk-tabs mb-3">
        <button className={`tk-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>Users ({users.length})</button>
        <button className={`tk-tab ${tab === 'jobs' ? 'active' : ''}`} onClick={() => setTab('jobs')}>Jobs ({jobs.length})</button>
        <button className={`tk-tab ${tab === 'projects' ? 'active' : ''}`} onClick={() => setTab('projects')}>Projects ({projects.length})</button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          {tab === 'users' && (users.length === 0 ? <Empty /> : (
            <div className="d-flex flex-column gap-2">
              {users.map((u) => (
                <div key={u.userId} className="tk-card tk-card-pad d-flex align-items-center gap-3">
                  <Avatar src={u.avatarUrl} name={u.fullName || u.username} size={44} />
                  <div>
                    <div className="fw-semibold">{u.fullName || u.username}</div>
                    <div className="text-muted small">@{u.username} · {u.role}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {tab === 'jobs' && (jobs.length === 0 ? <Empty /> : (
            <div className="d-flex flex-column gap-2">
              {jobs.map((j) => (
                <Link to={`/jobs/${j.jobId}`} key={j.jobId} className="tk-card tk-card-pad d-flex justify-content-between text-decoration-none text-dark">
                  <div>
                    <div className="fw-bold">{j.title}</div>
                    <div className="text-muted small">{j.category?.categoryName} · {j.location || 'Remote'}</div>
                  </div>
                  <div className="text-end">
                    <span className="tk-pill tk-pill-primary">{budgetRange(j.budget)}</span>
                    <div className="text-muted small mt-1">{timeAgo(j.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          ))}

          {tab === 'projects' && (projects.length === 0 ? <Empty /> : (
            <div className="d-flex flex-column gap-2">
              {projects.map((p) => (
                <Link to={`/projects/${p.projectId}`} key={p.projectId} className="tk-card tk-card-pad d-flex justify-content-between text-decoration-none text-dark">
                  <div>
                    <div className="fw-bold">{p.projectTitle}</div>
                    <div className="text-muted small">{p.category?.categoryName} · {p.duration || ''}</div>
                  </div>
                  <div className="text-end">
                    <span className="tk-pill tk-pill-primary">{budgetRange(p.budget)}</span>
                    <div className="text-muted small mt-1">{timeAgo(p.createdAt)}</div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

const Empty = () => <div className="tk-card tk-empty py-4"><i className="bi bi-search d-block mb-2"></i>No results found.</div>;

export default Search;
