import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../../services/auth';
import { timeAgo } from '../../lib/format';

const API = 'http://localhost:8081/api/cms';

const AdminCms = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = list, 'new' = create, object = edit
  const [form, setForm] = useState({ title: '', slug: '', content: '', status: true });
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    axios.get(API, { headers: authHeader() })
      .then((r) => setPages(r.data || []))
      .catch(() => setPages([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const reset = () => { setEditing(null); setForm({ title: '', slug: '', content: '', status: true }); };

  const startCreate = () => { setEditing('new'); setForm({ title: '', slug: '', content: '', status: true }); };

  const startEdit = (page) => {
    setEditing(page);
    setForm({ title: page.title || '', slug: page.slug || '', content: page.content || '', status: page.status ?? true });
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Auto-generate slug from title
  const onTitleChange = (e) => {
    const title = e.target.value;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setForm({ ...form, title, slug: editing === 'new' ? slug : form.slug });
  };

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editing === 'new') {
        await axios.post(API, form, { headers: { ...authHeader(), 'Content-Type': 'application/json' } });
        setMsg('Page created successfully!');
      } else {
        await axios.put(`${API}/${editing.pageId}`, form, { headers: { ...authHeader(), 'Content-Type': 'application/json' } });
        setMsg('Page updated successfully!');
      }
      reset(); load();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed to save page.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this page permanently?')) return;
    try { await axios.delete(`${API}/${id}`, { headers: authHeader() }); load(); } catch { alert('Failed to delete.'); }
  };

  // Editor view
  if (editing !== null) {
    return (
      <div>
        <div className="d-flex align-items-center gap-2 mb-3">
          <button className="btn btn-sm btn-outline-secondary" onClick={reset}>
            <i className="bi bi-arrow-left me-1"></i>Back
          </button>
          <h2 className="tk-page-title mb-0">{editing === 'new' ? 'Create Page' : 'Edit Page'}</h2>
        </div>

        {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}

        <div className="tk-card tk-card-pad" style={{ maxWidth: 800 }}>
          <form onSubmit={save}>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Page Title</label>
                <input name="title" className="form-control" placeholder="e.g. About Us"
                  value={form.title} onChange={onTitleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Slug (URL path)</label>
                <div className="input-group">
                  <span className="input-group-text">/page/</span>
                  <input name="slug" className="form-control" placeholder="about-us"
                    value={form.slug} onChange={onChange} required />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Content</label>
              <textarea name="content" className="form-control" rows={12} placeholder="Write your page content here..."
                value={form.content} onChange={onChange} required style={{ fontFamily: 'monospace', fontSize: '0.88rem' }} />
              <div className="text-muted small mt-1">Supports plain text. HTML tags will be rendered on the public page.</div>
            </div>

            <div className="form-check mb-4">
              <input className="form-check-input" type="checkbox" name="status" id="pageStatus"
                checked={form.status} onChange={onChange} />
              <label className="form-check-label" htmlFor="pageStatus">Published (visible to public)</label>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-check-lg me-1"></i>{editing === 'new' ? 'Create Page' : 'Save Changes'}
              </button>
              <button type="button" className="btn btn-outline-secondary" onClick={reset}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">CMS Pages</h2>
        <button className="btn btn-primary" onClick={startCreate}>
          <i className="bi bi-plus-lg me-1"></i>Create Page
        </button>
      </div>

      <p className="text-muted small mb-3">Manage static pages like About Us, Privacy Policy, Terms & Conditions, Contact Us.</p>

      {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : pages.length === 0 ? (
        <div className="tk-card tk-empty py-5">
          <i className="bi bi-file-richtext d-block mb-2" style={{ fontSize: '2rem' }}></i>
          <p className="mb-2">No CMS pages yet.</p>
          <button className="btn btn-primary btn-sm" onClick={startCreate}>Create Your First Page</button>
        </div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Public URL</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.pageId}>
                  <td className="ps-3 fw-semibold">{p.title}</td>
                  <td className="text-muted small">{p.slug}</td>
                  <td>
                    <span className={`tk-pill ${p.status ? 'tk-pill-green' : 'tk-pill-gray'}`}>
                      {p.status ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>
                    <a href={`/page/${p.slug}`} target="_blank" rel="noreferrer" className="small">
                      /page/{p.slug} <i className="bi bi-box-arrow-up-right"></i>
                    </a>
                  </td>
                  <td className="text-end pe-3">
                    <div className="d-flex gap-2 justify-content-end">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(p)}>
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.pageId)}>
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

export default AdminCms;
