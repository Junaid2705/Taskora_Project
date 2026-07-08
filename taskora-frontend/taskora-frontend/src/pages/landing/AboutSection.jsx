import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '5K+', label: 'Projects Completed' },
  { value: '2.5K+', label: 'Jobs Posted' },
  { value: '98%', label: 'Client Satisfaction' },
];

const AboutSection = () => {
  return (
    <section className="tk-landing-about" id="about">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <div className="tk-about-visual">
              <div className="tk-about-stats-grid">
                {stats.map((s) => (
                  <div className="tk-about-stat" key={s.label}>
                    <div className="tk-about-stat-value">{s.value}</div>
                    <div className="tk-about-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <p className="tk-landing-subtitle">About Taskora</p>
            <h2 className="tk-section-title">Empowering professionals to achieve their goals</h2>
            <p className="text-muted">
              Taskora is a comprehensive freelancer social networking platform designed to bring 
              freelancers, employers, recruiters, and creators together. We provide the tools and 
              connections needed to build successful professional relationships.
            </p>
            <p className="text-muted">
              Every feature is crafted with care — from real-time messaging and project bidding 
              to subscription monetization and portfolio showcasing. Our platform grows with you.
            </p>
            <Link to="/register" className="btn btn-primary mt-3">
              <i className="bi bi-arrow-right-circle me-2"></i>More About Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
