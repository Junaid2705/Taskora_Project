import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsError(true);
      setMessage("Invalid password reset link. No token provided.");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    AuthService.resetPassword(token, formData.newPassword).then(
      (response) => {
        setMessage(response.data.message || "Password successfully reset!");
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      },
      (error) => {
        const resMessage = (error.response && error.response.data && error.response.data.error) || "Failed to reset password. Token may be expired.";
        setMessage(resMessage);
        setIsError(true);
      }
    );
  };

  if (!token) {
    return (
      <div className="container py-5 text-center mt-5">
        <h4 className="text-danger">{message}</h4>
        <Link to="/forgot-password" className="btn btn-primary mt-3">Request New Link</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 mt-5 p-2 shadow-sm">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-dark">Create New Password</h3>
                <p className="text-muted">Please enter your new password below.</p>
              </div>

              {message && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} text-center fw-medium border-0 shadow-sm`} role="alert">
                  {message}
                </div>
              )}

              {!isSuccess && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">New Password</label>
                    <input 
                      type="password" 
                      name="newPassword"
                      className="form-control" 
                      placeholder="Enter new password" 
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Confirm New Password</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      className="form-control" 
                      placeholder="Confirm new password" 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-100 fw-bold mb-3">
                    Update Password
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;