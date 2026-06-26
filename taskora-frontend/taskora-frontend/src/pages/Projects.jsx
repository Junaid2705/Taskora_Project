import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectService from '../services/projectService';
import { budgetRange, timeAgo, statusPill } from '../lib/format';

const ProjectCard = ({ p }) => (
  <Link to={`/projects/${p.projectId}`} className="tk-card tk-job-card text-decoration-none text-dark">
    <div className="tk-job-logo" style={{ background: '#fff1e6', color: '#ea580c' }}><i className="bi bi-folder-fill"></i></div>
    <div className="flex-grow-1">
      <div className="d-flex justify-content-between align-items-start gap-2">
        <h6 className="fw-bold mb-1">{p.projectTitle}</h6>
        <span className="text-muted small text-nowrap">{timeAgo(p.createdAt)}</span>
      </div>
      <div className="text-muted small mb-2">{p.category?.categoryName || 'General'}</div>
      <div className="d-flex flex-wrap gap-2">
        <span className="tk-pill tk-pill-primary">{budgetRange(p.budget)}</span>
        {p.duration && <span className="tk-pill"><i className="bi bi-clock"></i>{p.duration}</span>}
        <span className={`tk-pill ${statusPill(p.projectStatus)}`}>{p.projectStatus}</span>
      </div>
    </div>
  </Link>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (kw = '') => {
    setLoading(true);
    const fn = kw ? ProjectService.search({ keyword: kw }) : ProjectService.getFeed();
    fn.then((r) => setProjects(r.data)).catch(() => setProjects([])).finally(() => setLoading(false));
  };
  useEffect(() => load(''), []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">Projects</h2>
        <Link to="/post-project" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Post Project</Link>
      </div>

      <form className="row g-2 mb-3" onSubmit={(e) => { e.preventDefault(); load(keyword); }}>
        <div className="col">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
            <input className="form-control" placeholder="Search projects..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
        </div>
        <div className="col-auto"><button className="btn btn-primary">Search</button></div>
      </form>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-folder2-open d-block mb-2"></i>No projects found.</div>
      ) : (
        <div className="d-flex flex-column gap-3">{projects.map((p) => <ProjectCard key={p.projectId} p={p} />)}</div>
      )}
    </div>
  );
};

export default Projects;
