import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import AuthService from "../services/authService";
import Brand from "../components/Brand";

// 1. IMPORT YOUR IMAGE HERE
// Make sure to change 'hero.png' to the exact name of your image file in the assets folder
import loginImage from "../assets/project-image1.png";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await AuthService.login(form.username, form.password);
      // Admins go to the admin panel, others to the app dashboard
      const isAdmin = data.role === "ROLE_ADMIN";
      const dest =
        location.state?.from?.pathname || (isAdmin ? "/admin" : "/dashboard");
      navigate(dest, { replace: true });
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.google) {
      setError("Google Sign-In is loading. Please try again in a moment.");
      return;
    }
    window.google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID_HERE",
      callback: handleGoogleCallback,
    });
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setError(
          "Google popup was blocked or dismissed. Please allow popups or try again."
        );
      }
    });
  };

  const handleGoogleCallback = async (response) => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8081/api/auth/google", {
        credential: response.credential,
      });
      const data = res.data;
      if (data.needsRole) {
        // New user — go to role selection
        navigate("/select-role", {
          state: {
            googleEmail: data.googleEmail,
            googleName: data.googleName,
            googleId: data.googleId,
          },
        });
      } else {
        // Existing user — store token and go to dashboard
        localStorage.setItem("user", JSON.stringify(data));
        const isAdmin = data.role === "ROLE_ADMIN";
        navigate(isAdmin ? "/admin" : "/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Google login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tk-auth">
      <div className="tk-auth-form">
        <div className="tk-auth-form-inner fade-in">
          <div className="mb-4">
            <Brand />
          </div>
          <h3 className="fw-bold mb-1">Welcome Back!</h3>
          <p className="text-muted mb-4">Login to your account</p>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Email or Username</label>
              <input
                name="username"
                className="form-control"
                placeholder="Enter email or username"
                value={form.username}
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Password</label>
              <div className="input-group">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  required
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
            <div className="text-end mb-3">
              <Link to="/forgot-password" className="small fw-semibold">
                Forgot Password?
              </Link>
            </div>
            <button className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="d-flex align-items-center my-3 text-muted small">
            <hr className="flex-grow-1" />
            <span className="mx-2">OR</span>
            <hr className="flex-grow-1" />
          </div>

          <div className="d-flex flex-column gap-2 mb-4">
            <button type="button" className="tk-social-btn" onClick={handleGoogleLogin}>
              <i className="bi bi-google text-danger"></i> Continue with Google
            </button>
            {/* <button type="button" className="tk-social-btn"><i className="bi bi-linkedin text-primary"></i> Continue with LinkedIn</button> */}
          </div>

          <p className="text-center text-muted mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="fw-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* 2. REPLACED SVG WITH THE IMPORTED IMAGE */}
      <div className="tk-auth-aside d-flex justify-content-center align-items-center">
        <img
          src={loginImage}
          alt="Login Illustration"
          className="img-fluid"
          style={{ maxWidth: "80%", maxHeight: "80vh", objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default Login;
