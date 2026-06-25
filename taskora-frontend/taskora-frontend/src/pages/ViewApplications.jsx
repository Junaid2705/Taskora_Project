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

      {/* Replace your existing applications map with this */}
      <div className="row g-4">
        {applications.map((app) => (
          <div className="col-12" key={app.applicationId}>
            <div className="card shadow-sm border-0 hover-lift">
              <div className="card-body p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-primary mb-0">
                    <img src={app.freelancer?.avatarUrl || "https://via.placeholder.com/40"} alt="avatar" className="rounded-circle me-2" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
                    {app.freelancer?.fullName}
                  </h5>
                  <span className={`badge px-3 py-2 rounded-pill ${app.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {app.status}
                  </span>
                </div>
                
                <h6 className="fw-bold text-dark mt-4">Proposal:</h6>
                <p className="bg-light p-4 rounded border-0 text-muted" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {app.coverLetter}
                </p>

                <div className="row align-items-center mt-4">
                  <div className="col-md-4">
                    <span className="text-muted d-block small">Expected Budget</span>
                    <span className="text-success fw-bold fs-5">${app.expectedSalary}</span>
                  </div>
                  <div className="col-md-4 text-md-center">
                    <span className="text-muted d-block small">Applied On</span>
                    <span className="fw-medium">{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="col-md-4 text-md-end mt-3 mt-md-0 d-flex justify-content-md-end gap-2">
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-outline-primary fw-bold rounded-pill">
                        Portfolio
                      </a>
                    )}
                    
                    {/* FIX #3: THE ACCEPT BUTTON API CALL */}
                    {app.status === 'PENDING' && (
                      <button 
                        className="btn btn-success fw-bold px-4 rounded-pill shadow-sm"
                        onClick={() => {
                          JobService.acceptApplication(app.applicationId).then(() => {
                            window.location.reload(); // Quick refresh to update status
                          });
                        }}
                      >
                        Accept Bid
                      </button>
                    )}
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