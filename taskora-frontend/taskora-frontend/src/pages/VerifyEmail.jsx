import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AuthService from '../services/authService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    AuthService.verifyEmail(token).then(
      (response) => {
        setStatus('success');
        setMessage(response.data.message || 'Email successfully verified!');
      },
      (error) => {
        setStatus('error');
        const resMessage = (error.response && error.response.data && error.response.data.error) || "Verification failed. The link may have expired.";
        setMessage(resMessage);
      }
    );
  }, [token]);

  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm p-4 mt-5">
            {status === 'loading' && (
              <div>
                <div className="spinner-border text-primary mb-3" role="status"></div>
                <h4>{message}</h4>
              </div>
            )}
            
            {status === 'success' && (
              <div>
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3 text-dark">Verified!</h4>
                <p className="text-muted">{message}</p>
                <Link to="/login" className="btn btn-primary w-100 fw-bold mt-3">Go to Login</Link>
              </div>
            )}

            {status === 'error' && (
              <div>
                <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
                <h4 className="mt-3 text-dark">Verification Failed</h4>
                <p className="text-danger">{message}</p>
                <Link to="/register" className="btn btn-outline-secondary w-100 fw-bold mt-3">Back to Registration</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;