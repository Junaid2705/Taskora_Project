import React from "react";
import { Link } from "react-router-dom";

// 1. IMPORT YOUR IMAGE HERE
// Pointing to the hero.png in your assets folder
import heroImage from "../../assets/project_image.png";

const HeroSection = () => {
  return (
    <section className="tk-landing-hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="tk-landing-subtitle">
              Freelancer Social Networking Platform
            </p>
            <h1 className="tk-landing-title">
              Connect. <span className="tk-accent-text">Collaborate.</span>
              <br />
              <span className="tk-accent">Grow.</span>
            </h1>
            <p className="tk-landing-desc">
              The ultimate platform for freelancers, employers and professionals
              to work, connect and grow together.
            </p>
            <div className="d-flex gap-3 flex-wrap mt-4">
              <Link
                to="/register"
                className="btn btn-primary btn-lg px-4 tk-landing-btn"
              >
                <i className="bi bi-rocket-takeoff me-2"></i>Get Started
              </Link>
              <a
                href="#services"
                className="btn btn-outline-primary btn-lg px-4 tk-landing-btn"
              >
                <i className="bi bi-arrow-down-circle me-2"></i>Explore Services
              </a>
            </div>
          </div>

          <div className="col-lg-6 text-center">
            <div className="tk-hero-visual">
              {/* Floating Stat Cards (Kept these so they float around your image) */}
              <div className="tk-hero-card tk-hero-card-1">
                <i className="bi bi-briefcase-fill"></i>
                <span>2,500+ Jobs Posted</span>
              </div>
              <div className="tk-hero-card tk-hero-card-2">
                <i className="bi bi-people-fill"></i>
                <span>10K+ Freelancers</span>
              </div>
              <div className="tk-hero-card tk-hero-card-3">
                <i className="bi bi-star-fill"></i>
                <span>98% Satisfaction</span>
              </div>

              {/* 2. REPLACED SVG WITH IMAGE TAG */}
              <div className="tk-hero-illustration">
                <img
                  src={heroImage}
                  alt="Taskora Hero Platform"
                  className="img-fluid"
                  style={{ maxHeight: "450px", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
