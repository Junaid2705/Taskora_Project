import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    AuthService.forgotPassword(email).then(
      (response) => {
        setMessage(response.data.message);
        setIsLoading(false);
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.error) || "Failed to send reset link.";
        setMessage(resMessage);
        setIsError(true);
        setIsLoading(false);
      }
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 mt-5 p-2 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-dark">Reset Password</h3>
                <p className="text-muted">Enter your email and we'll send you a link to get back into your account.</p>
              </div>

              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} text-center fw-medium border-0 shadow-sm`} role="alert">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold text-dark">Email Address</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 fw-bold mb-3" disabled={isLoading}>
                  {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/login" className="text-decoration-none text-muted fw-medium border-bottom border-secondary">
                  <i className="bi bi-arrow-left me-1"></i> Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;