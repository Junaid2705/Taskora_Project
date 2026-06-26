import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobService from '../services/jobService';

const PostJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', skillsRequired: '', budget: '',
    experienceRequired: '', location: '', deadline: '', categoryId: '',
  });
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
      const payload = { ...form, budget: form.budget ? Number(form.budget) : null, categoryId: Number(form.categoryId) };
      await JobService.createJob(payload);
      navigate('/my-jobs');
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Could not post the job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Post a Job</h2>
      <div className="tk-card tk-card-pad" style={{ maxWidth: 760 }}>
        {err && <div className="alert alert-danger py-2 small">{err}</div>}
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Job Title</label>
            <input name="title" className="form-control" value={form.title} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="description" rows="5" className="form-control" value={form.description} onChange={onChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Skills Required <span className="text-muted">(comma separated)</span></label>
            <input name="skillsRequired" className="form-control" placeholder="React, Node.js, MySQL"
              value={form.skillsRequired} onChange={onChange} />
          </div>
          <div className="row g-3">
            <div className="col-md-6 mb-3">
              <label className="form-label">Budget ($)</label>
              <input type="number" name="budget" className="form-control" value={form.budget} onChange={onChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Experience Required</label>
              <input name="experienceRequired" className="form-control" placeholder="e.g. Mid-level"
                value={form.experienceRequired} onChange={onChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Location</label>
              <input name="location" className="form-control" placeholder="Remote / City" value={form.location} onChange={onChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Deadline</label>
              <input type="date" name="deadline" className="form-control" value={form.deadline} onChange={onChange} />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label">Category</label>
            <select name="categoryId" className="form-select" value={form.categoryId} onChange={onChange} required>
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </div>
          <button className="btn btn-primary px-4" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
