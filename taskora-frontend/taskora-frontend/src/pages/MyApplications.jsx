import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobService from '../services/jobService';

const MyApplications = () => {
  const [myApps, setMyApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    JobService.getMyApplications().then(
      (response) => {
        setMyApps(response.data);
        setIsLoading(false);
      },
      (error) => {
        setError('Failed to load your applications.');
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <div className="container py-5">
      <div className="row mb-4 align-items-center">
        <div className="col-md-8">
          <h2 className="fw-bold text-dark mb-0">My Proposals</h2>
          <p className="text-muted">Track the status of your submitted job applications.</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link to="/jobs" className="btn btn-primary fw-bold">Find More Jobs</Link>
        </div>
      </div>

      {isLoading && <div className="text-center mt-5"><div className="spinner-border text-primary" role="status"></div></div>}
      
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!isLoading && !error && myApps.length === 0 && (
        <div className="text-center py-5 bg-light rounded shadow-sm border mt-4">
          <i className="bi bi-send text-muted" style={{ fontSize: '3rem' }}></i>
          <h4 className="mt-3 text-dark">You haven't applied to any jobs yet.</h4>
          <Link to="/jobs" className="btn btn-outline-primary mt-3">Browse Jobs</Link>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-hover align-middle border shadow-sm rounded overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>Job Title</th>
              <th>Date Applied</th>
              <th>My Bid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myApps.map((app) => (
              <tr key={app.applicationId}>
                <td className="fw-bold text-primary">{app.job?.title}</td>
                <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                <td className="fw-bold text-success">${app.expectedSalary}</td>
                <td>
                  <span className={`badge ${app.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-success'}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplications;