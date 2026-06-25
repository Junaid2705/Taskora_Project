import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const Login = () => {
  const navigate = useNavigate();

  // State management for login inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // --- NEW: State for Password Visibility Toggle ---
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    AuthService.login(formData.username, formData.password).then(
      () => {
        // Success! Redirect to the dashboard and refresh to update the Navbar
        navigate("/dashboard");
        window.location.reload();
      },
      (error) => {
        // Handle failed login (wrong password, user not found, etc.)
        const resMessage = "Invalid username or password. Please try again.";
        setMessage(resMessage);
        setIsError(true);
      },
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5 col-xl-4">
          <div
            className="card border-0 mt-4 p-2 shadow-sm"
            style={{ borderRadius: "15px" }}
          >
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-dark">Welcome Back</h3>
                <p className="text-muted">Login to your Taskora account</p>
              </div>

              {/* Status Alert Banner for Errors */}
              {message && (
                <div
                  className="alert alert-danger text-center fw-medium border-0 shadow-sm"
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label
                    htmlFor="username"
                    className="form-label fw-semibold text-dark"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    id="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold text-dark mb-0"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-decoration-none small fw-medium"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* --- NEW: Password Input Group with Toggle --- */}
                  <div className="input-group mt-2">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn d-flex align-items-center justify-content-center"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? "Hide password" : "Show password"}
                      style={{ fontSize: "1.2rem", padding: "0 0.75rem" }}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold mb-3"
                >
                  Login
                </button>
              </form>

              {/* Social Auth Divider */}
              <div className="d-flex align-items-center my-4">
                <hr className="flex-grow-1 text-muted opacity-25" />
                <span className="mx-3 text-muted small fw-medium">
                  Or continue with
                </span>
                <hr className="flex-grow-1 text-muted opacity-25" />
              </div>

              {/* Official Social Logo Buttons */}
              <div className="d-flex flex-column gap-3 mb-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 fw-medium text-dark border-opacity-50"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>

                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 fw-medium text-dark border-opacity-50"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#0A66C2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-50 d-flex align-items-center justify-content-center gap-2 fw-medium text-dark border-opacity-50"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="#1877F2"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>

              <div className="text-center mt-4">
                <p className="mb-0 text-muted fw-medium">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Register here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
