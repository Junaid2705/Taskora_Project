import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobService from '../services/jobService';

const ViewApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    JobService.getJobApplications(jobId).then(
      (response) => {
        setApplications(response.data);
        setIsLoading(false);
      },
      (error) => {
        setError('Failed to load applications. Make sure you are the employer who posted this job.');
        setIsLoading(false);
      }
    );
  }, [jobId]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Applicant Inbox</h2>
        <Link to="/jobs" className="btn btn-outline-secondary">Back to Jobs</Link>
      </div>

      {isLoading && <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>}
      
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!isLoading && !error && applications.length === 0 && (
        <div className="text-center py-5 bg-light rounded shadow-sm border mt-4">
          <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3 text-dark">No applications yet</h4>
          <p className="text-muted">Proposals will appear here once freelancers apply.</p>
        </div>
      )}

      <div className="row g-4">
        {applications.map((app) => (
          <div className="col-12" key={app.applicationId}>
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-primary mb-0">
                    <i className="bi bi-person-circle me-2"></i> {app.freelancer?.fullName}
                  </h5>
                  <span className={`badge ${app.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {app.status}
                  </span>
                </div>
                
                <h6 className="fw-bold">Proposal:</h6>
                <p className="bg-light p-3 rounded border text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {app.coverLetter}
                </p>

                <div className="row align-items-center mt-3">
                  <div className="col-md-4">
                    <strong>Expected Salary: </strong> <span className="text-success fw-bold">${app.expectedSalary}</span>
                  </div>
                  <div className="col-md-4">
                    <strong>Applied On: </strong> {new Date(app.appliedAt).toLocaleDateString()}
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0">
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-info me-2">
                        View Portfolio
                      </a>
                    )}
                    <button className="btn btn-sm btn-success">Accept</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewApplications;