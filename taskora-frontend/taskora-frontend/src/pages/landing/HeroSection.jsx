import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="tk-landing-hero">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <p className="tk-landing-subtitle">Freelancer Social Networking Platform</p>
            <h1 className="tk-landing-title">
              Delivering smart solutions for <span className="tk-accent-text">freelancers & employers</span>
            </h1>
            <p className="tk-landing-desc">
              We transform careers with powerful and adaptable digital solutions that connect freelancers, 
              employers, and creators on a single platform.
            </p>
            <div className="d-flex gap-3 flex-wrap mt-4">
              <Link to="/register" className="btn btn-primary btn-lg px-4 tk-landing-btn">
                <i className="bi bi-rocket-takeoff me-2"></i>Get Started
              </Link>
              <a href="#services" className="btn btn-outline-primary btn-lg px-4 tk-landing-btn">
                <i className="bi bi-arrow-down-circle me-2"></i>Explore Services
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center">
            <div className="tk-hero-visual">
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
              <div className="tk-hero-illustration">
                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="180" fill="#eff6ff" />
                  <circle cx="200" cy="200" r="130" fill="#dbeafe" />
                  <rect x="130" y="130" width="140" height="140" rx="20" fill="#2563eb" opacity="0.9" />
                  <circle cx="200" cy="120" r="40" fill="#fb923c" />
                  <rect x="160" y="290" width="80" height="12" rx="6" fill="#93c5fd" />
                  <rect x="145" y="310" width="110" height="8" rx="4" fill="#bfdbfe" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
