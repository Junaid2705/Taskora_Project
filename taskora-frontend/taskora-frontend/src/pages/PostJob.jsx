import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobService from '../services/jobService';

const PostJob = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    description: '',
    skillsRequired: '',
    experienceRequired: 'Beginner',
    location: '',
    budget: '',
    deadline: ''
  });
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories as soon as the component loads
  useEffect(() => {
    JobService.getCategories().then(
      (response) => {
        setCategories(response.data);
      },
      (error) => {
        console.error("Failed to load categories", error);
      }
    );
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    JobService.createJob(formData).then(
      (response) => {
        setMessage(response.data.message);
        setIsLoading(false);
        // Clear form after success
        setFormData({
          title: '', categoryId: '', description: '', skillsRequired: '',
          experienceRequired: 'Beginner', location: '', budget: '', deadline: ''
        });
        // Optional: Redirect to the feed after 2 seconds
        setTimeout(() => navigate('/jobs'), 2000);
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.error) || "Failed to post job. Please ensure you are logged in as an Employer.";
        setMessage(resMessage);
        setIsError(true);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white p-4">
              <h3 className="mb-0 fw-bold">Post a New Job</h3>
              <p className="mb-0 text-white-50">Find the perfect freelancer for your project</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mb-4`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-8">
                    <label className="form-label fw-semibold">Job Title</label>
                    <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Build a React Dashboard" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Category</label>
                    <select className="form-select" name="categoryId" value={formData.categoryId} onChange={handleChange} required>
                      <option value="">Select...</option>
                      {categories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Project Description</label>
                  <textarea className="form-control" name="description" rows="4" value={formData.description} onChange={handleChange} required placeholder="Describe the project scope and deliverables..."></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Required Skills</label>
                  <input type="text" className="form-control" name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} required placeholder="e.g. React, Node.js, Figma (Comma separated)" />
                </div>

                <div className="row mb-4">
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Budget ($)</label>
                    <input type="number" step="0.01" className="form-control" name="budget" value={formData.budget} onChange={handleChange} required placeholder="500.00" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Location</label>
                    <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Remote" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Experience</label>
                    <select className="form-select" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange}>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label fw-semibold">Deadline</label>
                    <input type="date" className="form-control" name="deadline" value={formData.deadline} onChange={handleChange} required />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold py-2" disabled={isLoading}>
                  {isLoading ? 'Publishing Job...' : 'Publish Job'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;