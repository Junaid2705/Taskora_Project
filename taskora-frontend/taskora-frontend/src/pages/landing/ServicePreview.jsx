import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ServicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Simulate network loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  // Protected Action Handler - Now redirects to /login
  const handleProtectedAction = (actionName) => {
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="preview-page bg-light pb-5" style={{ minHeight: "100vh" }}>
      {/* Universal Back Button */}
      <div className="container pt-4 pb-2">
        <button
          className="btn btn-outline-secondary btn-sm rounded-pill"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i> Back to Home
        </button>
      </div>

      <div className="container">
        {/* Conditional Rendering based on URL parameter */}
        {id === "jobs" && <JobsPreview onProtect={handleProtectedAction} />}
        {id === "projects" && (
          <ProjectsPreview onProtect={handleProtectedAction} />
        )}
        {id === "creators" && (
          <CreatorsPreview onProtect={handleProtectedAction} />
        )}
        {id === "social" && <SocialPreview />}
        {id === "messaging" && <MessagingPreview />}
      </div>
    </div>
  );
};

/* --- Sub-Components for Each Service View --- */

const JobsPreview = ({ onProtect }) => {
  const proxyJobs = [
    {
      id: 1,
      title: "Senior React Developer",
      employer: "TechFlow",
      type: "Remote",
      salary: "$80k - $100k",
      desc: "Looking for an experienced React developer to lead our frontend architecture. Must have 5+ years of experience with hooks, context, and state management.",
    },
    {
      id: 2,
      title: "Backend Java Engineer",
      employer: "DataSys",
      type: "On-site",
      salary: "$90k - $110k",
      desc: "Join our core infrastructure team building scalable microservices using Spring Boot and MySQL.",
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Job Marketplace</h2>
        <p className="text-muted">
          Browse the latest opportunities from top employers.
        </p>
      </div>
      <div className="row g-4">
        {proxyJobs.map((job) => (
          <div className="col-md-6" key={job.id}>
            <div className="card border-0 shadow-sm rounded-4 h-100 p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h5 className="fw-bold mb-0">{job.title}</h5>
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                  {job.salary}
                </span>
              </div>
              <p className="text-muted small fw-bold mb-3">
                <i className="bi bi-building me-1"></i> {job.employer}{" "}
                &nbsp;•&nbsp; <i className="bi bi-geo-alt me-1"></i> {job.type}
              </p>
              <p className="small text-secondary mb-4">{job.desc}</p>
              <button
                className="btn btn-primary w-100 mt-auto rounded-3 fw-bold"
                onClick={() => onProtect("apply for this job")}
              >
                Apply Now <i className="bi bi-box-arrow-up-right ms-1"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsPreview = ({ onProtect }) => {
  const proxyProjects = [
    {
      id: 1,
      title: "Build an E-commerce Store",
      budget: "$1,500",
      bids: 4,
      skills: ["React", "Node.js", "Stripe"],
      desc: "Need a full-stack developer to build a modern e-commerce platform with payment integration and an admin dashboard.",
    },
    {
      id: 2,
      title: "Design Corporate Landing Page",
      budget: "$400",
      bids: 12,
      skills: ["Figma", "UI/UX", "HTML/CSS"],
      desc: "Looking for a UI designer to create a clean, modern landing page for a financial consulting firm. Figma files required.",
    },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold">Project Bidding</h2>
          <p className="text-muted mb-0">
            Discover freelance projects and submit your proposals.
          </p>
        </div>
        <button
          className="btn btn-dark rounded-pill px-4"
          onClick={() => onProtect("post a new project")}
        >
          + Post a Project
        </button>
      </div>
      <div className="row g-4">
        {proxyProjects.map((project) => (
          <div className="col-12" key={project.id}>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="row align-items-center">
                <div className="col-md-9">
                  <h5 className="fw-bold">{project.title}</h5>
                  <p className="text-secondary small mb-3">{project.desc}</p>
                  <div className="d-flex flex-wrap gap-2 mb-3 mb-md-0">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge bg-light text-dark border px-2 py-1"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-md-3 text-md-end border-start-md">
                  <h4 className="fw-bold text-success mb-1">
                    {project.budget}
                  </h4>
                  <p className="text-muted small mb-3">
                    {project.bids} Active Bids
                  </p>
                  <button
                    className="btn btn-outline-primary w-100 rounded-pill fw-bold"
                    onClick={() => onProtect("place a bid on this project")}
                  >
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CreatorsPreview = ({ onProtect }) => {
  const proxyCreators = [
    {
      id: 1,
      name: "Alex Johnson",
      niche: "Web Dev Tutorials",
      tier: "Pro Creator",
      price: "$5/mo",
      bio: "Sharing weekly deep-dives into React, Spring Boot, and full-stack architecture.",
    },
    {
      id: 2,
      name: "Maria Garcia",
      niche: "UI/UX Design",
      tier: "Premium",
      price: "$12/mo",
      bio: "Exclusive access to my Figma source files, design system templates, and monthly Q&A.",
    },
  ];

  return (
    <div>
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Creator Subscriptions</h2>
        <p className="text-muted">
          Support your favorite professionals and unlock exclusive content.
        </p>
      </div>
      <div className="row g-4 justify-content-center">
        {proxyCreators.map((creator) => (
          <div className="col-md-5" key={creator.id}>
            <div className="card border-0 shadow-sm rounded-4 text-center p-4 h-100">
              <div
                className="mx-auto mb-3 bg-primary text-white d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "80px", height: "80px", fontSize: "1.5rem" }}
              >
                {creator.name.charAt(0)}
              </div>
              <h5 className="fw-bold mb-1">{creator.name}</h5>
              <p className="text-primary small fw-bold mb-3">{creator.niche}</p>
              <p className="text-secondary small mb-4">{creator.bio}</p>

              <div className="mt-auto d-flex gap-2">
                <button
                  className="btn btn-light w-50 fw-bold"
                  onClick={() => onProtect("view exclusive content")}
                >
                  View Content
                </button>
                <button
                  className="btn btn-dark w-50 fw-bold"
                  onClick={() => onProtect("subscribe to this creator")}
                >
                  Subscribe {creator.price}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialPreview = () => {
  return (
    <div>
      <div className="mb-4">
        <h2 className="fw-bold">Social Feed</h2>
        <p className="text-muted">Community updates and project showcases.</p>
      </div>
      <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
        <p className="fw-bold mb-4">Recent Community Uploads</p>
        <div className="row g-3">
          <div className="col-md-6">
            <img
              src="https://placehold.co/600x400/e2e8f0/475569?text=Project+Dashboard+Screenshot"
              alt="Social Feed 1"
              className="img-fluid rounded-3 shadow-sm"
            />
          </div>
          <div className="col-md-6">
            <img
              src="https://placehold.co/600x400/e2e8f0/475569?text=Design+System+Showcase"
              alt="Social Feed 2"
              className="img-fluid rounded-3 shadow-sm"
            />
          </div>
          <div className="col-md-12">
            <img
              src="https://placehold.co/1200x500/e2e8f0/475569?text=Mobile+App+Interface+Preview"
              alt="Social Feed 3"
              className="img-fluid rounded-3 shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const MessagingPreview = () => {
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Real-Time Messaging</h2>
        <p className="text-muted">
          Fast, secure communication between clients and freelancers.
        </p>
      </div>
      <div
        className="card border-0 shadow-sm rounded-4 p-3 w-100"
        style={{ maxWidth: "700px" }}
      >
        <img
          src="https://placehold.co/800x600/ffffff/2563eb?text=Live+Chat+Interface+Screenshot\n(User+Messages+&+Status)"
          alt="Messaging Interface"
          className="img-fluid rounded-3 border"
        />
      </div>
    </div>
  );
};

export default ServicePreview;
