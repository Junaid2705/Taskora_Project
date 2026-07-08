import React from 'react';

const services = [
  {
    icon: 'bi-briefcase-fill',
    title: 'Job Marketplace',
    desc: 'Post and find jobs with advanced search, categories, and application tracking.',
    color: '#2563eb',
  },
  {
    icon: 'bi-folder-fill',
    title: 'Project Bidding',
    desc: 'Post projects and receive competitive bids from skilled freelancers worldwide.',
    color: '#16a34a',
  },
  {
    icon: 'bi-chat-dots-fill',
    title: 'Real-Time Messaging',
    desc: 'WebSocket-powered instant messaging with online status and emoji support.',
    color: '#ea580c',
  },
  {
    icon: 'bi-star-fill',
    title: 'Creator Subscriptions',
    desc: 'Monetize your audience with subscription plans and revenue tracking.',
    color: '#9333ea',
  },
  {
    icon: 'bi-images',
    title: 'Portfolio Showcase',
    desc: 'Display your best work with images, videos, and project links.',
    color: '#0891b2',
  },
  {
    icon: 'bi-newspaper',
    title: 'Social Feed',
    desc: 'Share updates, engage with posts, comments, and likes in real-time.',
    color: '#dc2626',
  },
];

const ServicesSection = () => {
  return (
    <section className="tk-landing-services" id="services">
      <div className="container">
        <div className="text-center mb-5">
          <p className="tk-landing-subtitle">Our Platform Services</p>
          <h2 className="tk-section-title">Everything you need to succeed professionally</h2>
        </div>
        <div className="row g-4">
          {services.map((s) => (
            <div className="col-sm-6 col-lg-4" key={s.title}>
              <div className="tk-service-card">
                <div className="tk-service-icon" style={{ color: s.color }}>
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <h5 className="fw-bold mt-3">{s.title}</h5>
                <p className="text-muted small">{s.desc}</p>
                <span className="tk-service-link" style={{ color: s.color }}>
                  Learn More <i className="bi bi-arrow-right"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
