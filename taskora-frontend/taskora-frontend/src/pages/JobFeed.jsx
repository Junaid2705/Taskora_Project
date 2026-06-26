import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import JobService from '../services/jobService';
import { getRole } from '../services/auth';
import JobCard from '../components/JobCard';

const TABS = ['All Jobs', 'Full Time', 'Part Time', 'Remote'];

const JobFeed = () => {
  const [params] = useSearchParams();
  const isEmployer = getRole() === 'ROLE_EMPLOYER';
  const [keyword, setKeyword] = useState(params.get('keyword') || '');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState('All Jobs');
  const [loading, setLoading] = useState(true);

  const load = (kw = keyword, cat = categoryId) => {
    setLoading(true);
    const query = {};
    if (kw) query.keyword = kw;
    if (cat) query.categoryId = cat;
    JobService.searchJobs(query)
      .then((r) => setJobs(r.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    JobService.getCategories().then((r) => setCategories(r.data)).catch(() => {});
    load(params.get('keyword') || '', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onSearch = (e) => { e.preventDefault(); load(); };

  const filtered = jobs.filter((j) => {
    if (tab === 'All Jobs') return true;
    const text = `${j.title} ${j.location} ${j.experienceRequired} ${j.skillsRequired}`.toLowerCase();
    return text.includes(tab.toLowerCase());
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">Jobs</h2>
        {isEmployer && <Link to="/post-job" className="btn btn-primary"><i className="bi bi-plus-lg me-1"></i>Post Job</Link>}
      </div>

      <form className="row g-2 mb-3" onSubmit={onSearch}>
        <div className="col-12 col-md">
          <div className="input-group">
            <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
            <input className="form-control" placeholder="Search jobs..." value={keyword}
              onChange={(e) => setKeyword(e.target.value)} />
          </div>
        </div>
        <div className="col-8 col-md-3">
          <select className="form-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </select>
        </div>
        <div className="col-4 col-md-auto">
          <button className="btn btn-primary w-100"><i className="bi bi-funnel me-1"></i>Filter</button>
        </div>
      </form>

      <div className="tk-tabs mb-3">
        {TABS.map((t) => (
          <button key={t} className={`tk-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-search d-block mb-2"></i>No jobs found.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((j) => <JobCard key={j.jobId} job={j} />)}
        </div>
      )}
    </div>
  );
};

export default JobFeed;
