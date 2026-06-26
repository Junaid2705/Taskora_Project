import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/authService';
import Brand from '../components/Brand';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setErr(''); setLoading(true);
    try {
      await AuthService.forgotPassword(email);
      setMsg('If an account exists for that email, a reset link has been sent.');
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tk-auth">
      <div className="tk-auth-form mx-auto">
        <div className="tk-auth-form-inner fade-in">
          <div className="mb-4"><Brand /></div>
          <h3 className="fw-bold mb-1">Forgot Password?</h3>
          <p className="text-muted mb-4">Enter your email and we'll send you a reset link.</p>
          {msg && <div className="alert alert-success py-2 small">{msg}</div>}
          {err && <div className="alert alert-danger py-2 small">{err}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-center text-muted mb-0"><Link to="/login" className="fw-semibold">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
