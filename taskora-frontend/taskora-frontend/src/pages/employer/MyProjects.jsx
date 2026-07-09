import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectService from '../../services/projectService';
import { budgetRange, timeAgo, statusPill } from '../../lib/format';

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    ProjectService.getMyProjects().then((r) => setProjects(r.data)).catch(() => setProjects([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try { await ProjectService.deleteProject(id); load(); } catch { alert('Could not delete the project.'); }
  };

  const statusLabel = (s) => {
    if (s === 'PENDING_APPROVAL') return 'Pending Approval';
    if (s === 'IN_PROGRESS') return 'In Progress';
    return s;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">My Projects</h2>
        <Link to="/post-project" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Post Project</Link>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-folder d-block mb-2"></i>You haven't posted any projects yet.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {projects.map((p) => (
            <div key={p.projectId} className="tk-card tk-card-pad">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <div>
                  <Link to={`/projects/${p.projectId}`} className="fw-bold text-dark text-decoration-none">{p.projectTitle}</Link>
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    <span className="tk-pill tk-pill-primary">{budgetRange(p.budget)}</span>
                    {p.category && <span className="tk-pill">{p.category.categoryName}</span>}
                    <span className={`tk-pill ${statusPill(p.projectStatus)}`}>{statusLabel(p.projectStatus)}</span>
                    {p.duration && <span className="tk-pill"><i className="bi bi-clock me-1"></i>{p.duration}</span>}
                    <span className="tk-pill text-muted"><i className="bi bi-calendar me-1"></i>{timeAgo(p.createdAt)}</span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Link to={`/projects/${p.projectId}`} className="btn btn-sm btn-outline-primary">View Bids</Link>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onDelete(p.projectId)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjects;
