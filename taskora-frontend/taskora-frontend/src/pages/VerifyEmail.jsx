import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthService from '../services/authService';
import Brand from '../components/Brand';

const VerifyEmail = () => {
  const [params] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const token = params.get('token');
    if (!token) { setStatus('error'); return; }
    AuthService.verifyEmail(token).then(() => setStatus('success')).catch(() => setStatus('error'));
  }, [params]);

  return (
    <div className="tk-auth">
      <div className="tk-auth-form mx-auto">
        <div className="tk-auth-form-inner text-center fade-in">
          <div className="mb-4 d-flex justify-content-center"><Brand /></div>
          {status === 'loading' && (
            <><div className="spinner-border text-primary mb-3" /><p className="text-muted">Verifying your email...</p></>
          )}
          {status === 'success' && (
            <>
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              <h4 className="fw-bold mt-3">Email Verified!</h4>
              <p className="text-muted">Your account is now verified. You can log in.</p>
              <Link to="/login" className="btn btn-primary px-4">Go to Login</Link>
            </>
          )}
          {status === 'error' && (
            <>
              <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: '3rem' }}></i>
              <h4 className="fw-bold mt-3">Verification Failed</h4>
              <p className="text-muted">The link is invalid or has expired.</p>
              <Link to="/login" className="btn btn-outline-primary px-4">Back to Login</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
