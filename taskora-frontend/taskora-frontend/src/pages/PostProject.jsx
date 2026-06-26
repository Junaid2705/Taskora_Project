import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectService from '../services/projectService';
import JobService from '../services/jobService';

const PostProject = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ projectTitle: '', description: '', budget: '', duration: '', categoryId: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    JobService.getCategories().then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      await ProjectService.createProject({
        ...form,
        budget: form.budget ? Number(form.budget) : null,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
      });
      navigate('/projects');
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Could not create the project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Post a Project</h2>
      <div className="tk-card tk-card-pad" style={{ maxWidth: 760 }}>
        {err && <div className="alert alert-danger py-2 small">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Project Title</label>
            <input name="projectTitle" className="form-control" value={form.projectTitle} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" rows="5" className="form-control" value={form.description} onChange={onChange} required />
          </div>
          <div className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Budget ($)</label>
              <input type="number" name="budget" className="form-control" value={form.budget} onChange={onChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Duration</label>
              <input name="duration" className="form-control" placeholder="e.g. 30 Days" value={form.duration} onChange={onChange} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Category</label>
            <select name="categoryId" className="form-select" value={form.categoryId} onChange={onChange}>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </div>
          <button className="btn btn-primary px-4" disabled={loading}>{loading ? 'Posting...' : 'Submit Project'}</button>
        </form>
      </div>
    </div>
  );
};

export default PostProject;
