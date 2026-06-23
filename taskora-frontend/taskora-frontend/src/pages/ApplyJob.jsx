import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import JobService from '../services/jobService';

const ApplyJob = () => {
  const { jobId } = useParams(); // Grabs the Job ID from the URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    jobId: jobId,
    coverLetter: '',
    expectedSalary: '',
    resumeUrl: ''
  });
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    JobService.applyForJob(formData).then(
      (response) => {
        setMessage(response.data.message);
        setIsLoading(false);
        // Redirect back to feed after successful application
        setTimeout(() => navigate('/jobs'), 2000);
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.error) || "Failed to submit application. Make sure you are logged in as a Freelancer.";
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
            <div className="card-header bg-success text-white p-4">
              <h3 className="mb-0 fw-bold">Submit Your Proposal</h3>
              <p className="mb-0 text-white-50">Tell the client why you are the perfect fit for this project.</p>
            </div>
            
            <div className="card-body p-4 p-md-5">
              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mb-4`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Cover Letter / Proposal</label>
                  <textarea 
                    className="form-control" 
                    name="coverLetter" 
                    rows="6" 
                    value={formData.coverLetter} 
                    onChange={handleChange} 
                    required 
                    placeholder="Hi! I have 4 years of experience building similar projects and I'd love to help you with this..."
                  ></textarea>
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Expected Budget / Salary ($)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="form-control" 
                      name="expectedSalary" 
                      value={formData.expectedSalary} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. 1200.00" 
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Portfolio or Resume URL (Optional)</label>
                    <input 
                      type="url" 
                      className="form-control" 
                      name="resumeUrl" 
                      value={formData.resumeUrl} 
                      onChange={handleChange} 
                      placeholder="https://yourwebsite.com" 
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/jobs" className="text-decoration-none text-muted">
                    <i className="bi bi-arrow-left me-1"></i> Cancel
                  </Link>
                  <button type="submit" className="btn btn-success fw-bold px-5 py-2" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;