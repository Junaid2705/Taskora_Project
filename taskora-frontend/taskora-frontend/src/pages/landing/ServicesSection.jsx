import React from "react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    id: "jobs",
    icon: "bi-briefcase-fill",
    title: "Job Marketplace",
    desc: "Post and find jobs with advanced search, categories, and application tracking.",
    color: "#2563eb",
  },
  {
    id: "projects",
    icon: "bi-folder-fill",
    title: "Project Bidding",
    desc: "Post projects and receive competitive bids from skilled freelancers worldwide.",
    color: "#16a34a",
  },
  {
    id: "creators",
    icon: "bi-star-fill",
    title: "Creator Subscriptions",
    desc: "Monetize your audience with subscription plans and revenue tracking.",
    color: "#9333ea",
  },
  {
    id: "social",
    icon: "bi-newspaper",
    title: "Social Feed",
    desc: "Share updates, engage with posts, comments, and likes in real-time.",
    color: "#dc2626",
  },
  {
    id: "messaging",
    icon: "bi-chat-dots-fill",
    title: "Real-Time Messaging",
    desc: "WebSocket-powered instant messaging with online status and emoji support.",
    color: "#ea580c",
  },
];

const ServicesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="tk-landing-services py-5" id="services">
      <div className="container">
        <div className="text-center mb-5">
          <p className="tk-landing-subtitle text-uppercase fw-bold text-primary">
            Our Platform Services
          </p>
          <h2 className="tk-section-title display-6 fw-bold">
            Everything you need to succeed
          </h2>
        </div>

        <div className="row g-4 justify-content-center">
          {services.map((s) => (
            <div className="col-sm-6 col-lg-4" key={s.id}>
              <div
                className="tk-service-card shadow-sm h-100 d-flex flex-column border-0"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "15px",
                  padding: "2rem",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div
                  className="tk-service-icon mb-3"
                  style={{ color: s.color, fontSize: "2.5rem" }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <h5 className="fw-bold mb-3">{s.title}</h5>
                <p className="text-muted small mb-4">{s.desc}</p>

                <button
                  className="btn btn-light mt-auto text-start fw-bold w-100 d-flex justify-content-between align-items-center"
                  style={{
                    color: s.color,
                    borderRadius: "10px",
                    padding: "10px 15px",
                  }}
                  onClick={() => navigate(`/preview/${s.id}`)}
                >
                  Live Preview <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
