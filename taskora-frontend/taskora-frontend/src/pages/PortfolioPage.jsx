import React, { useEffect, useRef, useState } from 'react';
import PortfolioService from '../services/portfolioService';
import { getCurrentUser } from '../services/auth';
import { timeAgo } from '../lib/format';

const CATEGORIES = ['Web Development', 'Mobile App', 'UI/UX Design', 'AI & ML', 'Cloud Computing', 'Graphic Design', 'Other'];
const FILE_TYPES = ['IMAGE', 'VIDEO', 'DOCUMENT'];

const PortfolioPage = () => {
  const me = getCurrentUser() || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('All');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ title: '', description: '', projectUrl: '', category: '', fileType: 'IMAGE', file: null });
  const fileRef = useRef();

  const load = () => {
    setLoading(true);
    PortfolioService.getMyPortfolio()
      .then((r) => setItems(r.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const resetForm = () => {
    setForm({ title: '', description: '', projectUrl: '', category: '', fileType: 'IMAGE', file: null });
    setEditing(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const startEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || '',
      description: item.description || '',
      projectUrl: item.projectUrl || '',
      category: item.category || '',
      fileType: item.fileType || 'IMAGE',
      file: null,
    });
    setShowForm(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!form.title.trim()) { setMsg('Title is required.'); return; }
    try {
      if (editing) {
        await PortfolioService.update(editing.portfolioId, form);
        setMsg('Portfolio item updated!');
      } else {
        await PortfolioService.create(form);
        setMsg('Portfolio item created!');
      }
      resetForm();
      load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to save.');
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try { await PortfolioService.delete(id); load(); } catch { alert('Failed to delete.'); }
  };

  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter);
  const usedCategories = [...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">My Portfolio</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="bi bi-plus-lg me-1"></i>Add Project
        </button>
      </div>

      {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}

      {/* Create/Edit Form */}
      {showForm && (
        <div className="tk-card tk-card-pad mb-4">
          <h6 className="fw-bold mb-3">{editing ? 'Edit Portfolio Item' : 'Add New Portfolio Item'}</h6>
          <form onSubmit={onSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Title *</label>
                <input className="form-control" placeholder="Project name" value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Category</label>
                <select className="form-select" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows={3} placeholder="Describe the project..."
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Project URL</label>
                <input className="form-control" placeholder="https://github.com/... or live site"
                  value={form.projectUrl} onChange={(e) => setForm({ ...form, projectUrl: e.target.value })} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">File Type</label>
                <select className="form-select" value={form.fileType}
                  onChange={(e) => setForm({ ...form, fileType: e.target.value })}>
                  {FILE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Upload File</label>
                <input type="file" className="form-control" ref={fileRef}
                  accept={form.fileType === 'IMAGE' ? 'image/*' : form.fileType === 'VIDEO' ? 'video/*' : '*'}
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-check-lg me-1"></i>{editing ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category filter tabs */}
      {usedCategories.length > 0 && (
        <div className="tk-tabs mb-3">
          <button className={`tk-tab ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>All</button>
          {usedCategories.map((c) => (
            <button key={c} className={`tk-tab ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>
      )}

      {/* Portfolio grid */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="tk-card tk-empty py-5">
          <i className="bi bi-images d-block mb-2" style={{ fontSize: '2.5rem' }}></i>
          <p className="mb-2">No portfolio items yet.</p>
          <button className="btn btn-primary btn-sm" onClick={() => { resetForm(); setShowForm(true); }}>Add Your First Project</button>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.portfolioId}>
              <div className="tk-card h-100 overflow-hidden">
                {/* Thumbnail/Preview */}
                {item.fileUrl || item.thumbnail ? (
                  item.fileType === 'VIDEO' ? (
                    <video src={item.fileUrl} className="w-100" style={{ height: 180, objectFit: 'cover' }} controls />
                  ) : (
                    <img src={item.fileUrl || item.thumbnail} alt={item.title}
                      className="w-100" style={{ height: 180, objectFit: 'cover' }} />
                  )
                ) : (
                  <div className="w-100 d-flex align-items-center justify-content-center bg-light" style={{ height: 180 }}>
                    <i className={`bi ${item.fileType === 'DOCUMENT' ? 'bi-file-earmark-text' : item.fileType === 'VIDEO' ? 'bi-play-circle' : 'bi-image'}`}
                      style={{ fontSize: '3rem', color: '#94a3b8' }}></i>
                  </div>
                )}

                {/* Content */}
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className="fw-bold mb-0">{item.title}</h6>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-link text-muted p-0" title="Edit" onClick={() => startEdit(item)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-link text-danger p-0" title="Delete" onClick={() => deleteItem(item.portfolioId)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  {item.category && <span className="tk-pill tk-pill-primary mb-2">{item.category}</span>}
                  {item.fileType && item.fileType !== 'IMAGE' && <span className="tk-pill tk-pill-gray ms-1 mb-2">{item.fileType}</span>}

                  {item.description && (
                    <p className="text-muted small mt-2 mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                  )}

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    {item.projectUrl ? (
                      <a href={item.projectUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
                        <i className="bi bi-box-arrow-up-right me-1"></i>View
                      </a>
                    ) : <span></span>}
                    <span className="text-muted small">{timeAgo(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
