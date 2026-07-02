import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";
import Brand from "../components/Brand";

// 1. IMPORT YOUR IMAGE HERE
// Make sure to change 'hero.png' to the exact name of your image file if different
import registerImage from "../assets/project-image2.png";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
    role: "FREELANCER",
  });
  const [agree, setAgree] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (!agree)
      return setError("Please accept the Terms & Conditions to continue.");
    setLoading(true);
    try {
      await AuthService.register(form);
      setSuccess(
        "Account created! Please check your email to verify, then login.",
      );
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tk-auth">
      <div className="tk-auth-form">
        <div className="tk-auth-form-inner fade-in">
          <div className="mb-3">
            <Brand />
          </div>
          <h3 className="fw-bold mb-1">Create Account</h3>
          <p className="text-muted mb-3">Join Taskora today</p>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}
          {success && (
            <div className="alert alert-success py-2 small">{success}</div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-2">
              <label className="form-label">Full Name</label>
              <input
                name="fullName"
                className="form-control"
                placeholder="Enter full name"
                value={form.fullName}
                onChange={onChange}
                required
              />
            </div>
            <div className="row g-2">
              <div className="col-sm-6 mb-2">
                <label className="form-label">Username</label>
                <input
                  name="username"
                  className="form-control"
                  placeholder="Choose a username"
                  value={form.username}
                  onChange={onChange}
                  required
                />
              </div>
              <div className="col-sm-6 mb-2">
                <label className="form-label">Mobile</label>
                <input
                  name="mobile"
                  className="form-control"
                  placeholder="Mobile number"
                  value={form.mobile}
                  onChange={onChange}
                  required
                />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
            <div className="row g-2">
              <div className="col-sm-6 mb-2">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPwd ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={form.password}
                    onChange={onChange}
                    required
                    minLength={6}
                  />
                  <span
                    className="input-group-text tk-input-eye"
                    onClick={() => setShowPwd(!showPwd)}
                  >
                    <i
                      className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </span>
                </div>
              </div>
              <div className="col-sm-6 mb-2">
                <label className="form-label">Confirm Password</label>
                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirm"
                    className="form-control"
                    placeholder="Confirm"
                    value={form.confirm}
                    onChange={onChange}
                    required
                  />
                  <span
                    className="input-group-text tk-input-eye"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    <i
                      className={`bi ${showConfirm ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </span>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">I am a</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={onChange}
              >
                <option value="FREELANCER">Freelancer</option>
                <option value="EMPLOYER">Employer</option>
                <option value="CREATOR">Creator</option>
              </select>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label
                className="form-check-label small text-muted"
                htmlFor="agree"
              >
                I agree to the{" "}
                <span className="text-primary">Terms & Conditions</span> and
                Privacy Policy
              </label>
            </div>
            <button className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          <p className="text-center text-muted mb-0">
            Already have an account?{" "}
            <Link to="/login" className="fw-bold">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* 2. REPLACED SVG WITH THE IMPORTED IMAGE */}
      <div className="tk-auth-aside d-flex justify-content-center align-items-center">
        <img
          src={registerImage}
          alt="Registration Illustration"
          className="img-fluid"
          style={{ maxWidth: "80%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default Register;
