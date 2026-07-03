import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Brand from "../components/Brand";

const SelectRole = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { googleEmail, googleName, googleId } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!googleEmail) {
    navigate("/login", { replace: true });
    return null;
  }

  const selectRole = async (role) => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8081/api/auth/google/complete",
        { googleEmail, googleName, googleId, role }
      );
      const data = res.data;
      // Store auth data (same format as normal login)
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: data.token,
          id: data.id,
          username: data.username,
          email: data.email,
          role: data.role,
        })
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      key: "FREELANCER",
      icon: "bi-code-slash",
      label: "Freelancer",
      desc: "Find work, bid on projects, apply for jobs",
    },
    {
      key: "EMPLOYER",
      icon: "bi-building",
      label: "Employer",
      desc: "Post jobs, post projects, hire freelancers",
    },
    {
      key: "CREATOR",
      icon: "bi-palette",
      label: "Creator",
      desc: "Create content, build audience, monetize with subscriptions",
    },
  ];

  return (
    <div className="tk-auth">
      <div className="tk-auth-form" style={{ maxWidth: 500 }}>
        <div className="tk-auth-form-inner fade-in text-center">
          <div className="mb-4">
            <Brand />
          </div>
          <h3 className="fw-bold mb-1">
            Welcome, {googleName || googleEmail}!
          </h3>
          <p className="text-muted mb-4">
            Choose your role to get started on Taskora
          </p>

          {error && (
            <div className="alert alert-danger py-2 small">{error}</div>
          )}

          <div className="d-flex flex-column gap-3">
            {roles.map((r) => (
              <button
                key={r.key}
                className="btn btn-outline-primary d-flex align-items-center gap-3 py-3 px-4 text-start"
                onClick={() => selectRole(r.key)}
                disabled={loading}
              >
                <i className={`bi ${r.icon} fs-3`}></i>
                <div>
                  <div className="fw-bold">{r.label}</div>
                  <div className="text-muted small">{r.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <p className="text-muted small mt-4 mb-0">
            Signing up as <strong>{googleEmail}</strong>
          </p>
        </div>
      </div>
      <div className="tk-auth-aside d-flex justify-content-center align-items-center">
        <svg
          width="360"
          height="360"
          viewBox="0 0 360 360"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="180" cy="180" r="150" fill="#dbe6ff" />
          <rect x="110" y="120" width="140" height="120" rx="12" fill="#2563eb" />
          <circle cx="180" cy="100" r="34" fill="#fb923c" />
          <rect x="130" y="250" width="100" height="14" rx="7" fill="#93c5fd" />
        </svg>
      </div>
    </div>
  );
};

export default SelectRole;
