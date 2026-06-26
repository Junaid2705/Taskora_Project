import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryName: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    AdminService.getCategories()
      .then((r) => setCategories(r.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const reset = () => { setForm({ categoryName: '', description: '' }); setEditId(null); };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      if (editId) {
        await AdminService.updateCategory(editId, form);
        setMsg('Category updated.');
      } else {
        await AdminService.createCategory(form);
        setMsg('Category created.');
      }
      reset();
      load();
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Operation failed.');
    }
  };

  const edit = (c) => {
    setEditId(c.categoryId);
    setForm({ categoryName: c.categoryName, description: c.description || '' });
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try { await AdminService.deleteCategory(id); load(); } catch { alert('Failed.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Category Management</h2>
      <div className="row g-3">
        <div className="col-lg-4">
          <div className="tk-card tk-card-pad">
            <h6 className="fw-bold mb-3">{editId ? 'Edit Category' : 'Add Category'}</h6>
            {msg && <div className="alert alert-info py-2 small">{msg}</div>}
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <input className="form-control" placeholder="Category name" value={form.categoryName}
                  onChange={(e) => setForm({ ...form, categoryName: e.target.value })} required />
              </div>
              <div className="mb-3">
                <input className="form-control" placeholder="Description (optional)" value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-primary flex-grow-1">{editId ? 'Update' : 'Add'}</button>
                {editId && <button type="button" className="btn btn-outline-secondary" onClick={reset}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="tk-card overflow-auto">
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary spinner-border-sm" /></div>
            ) : categories.length === 0 ? (
              <div className="text-center text-muted py-4 small">No categories yet.</div>
            ) : (
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light"><tr><th className="ps-3">Name</th><th>Description</th><th>Status</th><th className="text-end pe-3">Actions</th></tr></thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.categoryId}>
                      <td className="ps-3 fw-semibold">{c.categoryName}</td>
                      <td className="text-muted small">{c.description || '—'}</td>
                      <td><span className={`tk-pill ${c.status ? 'tk-pill-green' : 'tk-pill-gray'}`}>{c.status ? 'Active' : 'Inactive'}</span></td>
                      <td className="text-end pe-3">
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(c)}><i className="bi bi-pencil"></i></button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(c.categoryId)}><i className="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
