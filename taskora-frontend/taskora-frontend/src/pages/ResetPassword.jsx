import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../services/authService';
import Brand from '../components/Brand';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    if (pwd !== confirm) return setErr('Passwords do not match.');
    if (!token) return setErr('Missing or invalid reset token.');
    setLoading(true);
    try {
      await AuthService.resetPassword(token, pwd);
      setMsg('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1600);
    } catch (e2) {
      setErr(e2.response?.data?.error || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tk-auth">
      <div className="tk-auth-form mx-auto">
        <div className="tk-auth-form-inner fade-in">
          <div className="mb-4"><Brand /></div>
          <h3 className="fw-bold mb-1">Reset Password</h3>
          <p className="text-muted mb-4">Create a new password for your account.</p>
          {msg && <div className="alert alert-success py-2 small">{msg}</div>}
          {err && <div className="alert alert-danger py-2 small">{err}</div>}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input type="password" className="form-control" placeholder="New password"
                value={pwd} onChange={(e) => setPwd(e.target.value)} required minLength={6} />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input type="password" className="form-control" placeholder="Confirm password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-muted mb-0"><Link to="/login" className="fw-semibold">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
