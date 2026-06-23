import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/authService";

const Register = () => {
  const navigate = useNavigate();

  // State management for form tracking
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "FREELANCER",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Generic handler to capture text input dynamically
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    // Frontend validation guard clause
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      setIsError(true);
      return;
    }

    AuthService.register(
      formData.fullName,
      formData.username,
      formData.mobile,
      formData.email,
      formData.password,
      formData.role,
    ).then(
      (response) => {
        setMessage(response.data.message || "Registration successful!");
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after success
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.error) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
        setIsError(true);
      },
    );
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 mt-4 p-2">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h3 className="fw-bold text-dark">Create an Account</h3>
                <p className="text-muted">
                  Join Taskora and build your professional network
                </p>
              </div>

              {/* Status Alert Banner */}
              {message && (
                <div
                  className={`alert ${isError ? "alert-danger" : "alert-success"} text-center fw-medium border-0 shadow-sm`}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      className="form-control"
                      placeholder="johndoe123"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      className="form-control"
                      placeholder="+1 234 567 8900"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-dark">
                      I want to join as a:
                    </label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="FREELANCER">
                        Freelancer (Looking for work)
                      </option>
                      <option value="EMPLOYER">Employer (Hiring talent)</option>
                      <option value="CREATOR">
                        Creator (Building an audience)
                      </option>
                    </select>
                  </div>

                  <div className="col-12 mb-3">
                    <label className="form-label fw-semibold text-dark">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Create password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-dark">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2 mb-3"
                >
                  Create Account
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0 text-muted fw-medium">
                  Already have an account?{" "}
                  <Link to="/login" className="text-decoration-none fw-bold">
                    Login here
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

export default Register;
