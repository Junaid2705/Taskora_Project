import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/authService';
import Brand from '../components/Brand';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await AuthService.login(form.username, form.password);
      // Admins go to the admin panel, others to the app dashboard
      const isAdmin = data.role === 'ROLE_ADMIN';
      const dest = location.state?.from?.pathname || (isAdmin ? '/admin' : '/dashboard');
      navigate(dest, { replace: true });
    } catch {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tk-auth">
      <div className="tk-auth-form">
        <div className="tk-auth-form-inner fade-in">
          <div className="mb-4"><Brand /></div>
          <h3 className="fw-bold mb-1">Welcome Back!</h3>
          <p className="text-muted mb-4">Login to your account</p>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email or Username</label>
              <input name="username" className="form-control" placeholder="Enter email or username"
                value={form.username} onChange={onChange} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input type={showPwd ? 'text' : 'password'} name="password" className="form-control"
                  placeholder="Enter your password" value={form.password} onChange={onChange} required />
                <span className="input-group-text tk-input-eye" onClick={() => setShowPwd(!showPwd)}>
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </span>
              </div>
            </div>
            <div className="text-end mb-3">
              <Link to="/forgot-password" className="small fw-semibold">Forgot Password?</Link>
            </div>
            <button className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="d-flex align-items-center my-3 text-muted small">
            <hr className="flex-grow-1" /><span className="mx-2">OR</span><hr className="flex-grow-1" />
          </div>

          <div className="d-flex flex-column gap-2 mb-4">
            <button type="button" className="tk-social-btn"><i className="bi bi-google text-danger"></i> Continue with Google</button>
            {/* <button type="button" className="tk-social-btn"><i className="bi bi-linkedin text-primary"></i> Continue with LinkedIn</button> */}
          </div>

          <p className="text-center text-muted mb-0">
            Don't have an account? <Link to="/register" className="fw-bold">Sign Up</Link>
          </p>
        </div>
      </div>
      <div className="tk-auth-aside">
        <svg width="360" height="360" viewBox="0 0 360 360" xmlns="http://www.w3.org/2000/svg">
          <circle cx="180" cy="180" r="150" fill="#dbe6ff" />
          <rect x="110" y="120" width="140" height="120" rx="12" fill="#2563eb" />
          <circle cx="180" cy="100" r="34" fill="#fb923c" />
          <rect x="130" y="250" width="100" height="14" rx="7" fill="#93c5fd" />
        </svg>
      </div>
    </div>
  );
};

export default Login;
