import React from 'react';

const features = [
  {
    icon: 'bi-people-fill',
    title: 'Expert Freelancers',
    desc: 'Connect with highly skilled professionals from every field.',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: 'bi-headset',
    title: '24/7 Support',
    desc: 'Round-the-clock support to help you resolve any issues.',
    color: '#16a34a',
    bg: '#f0fdf4',
  },
  {
    icon: 'bi-currency-dollar',
    title: 'Competitive Pricing',
    desc: 'Transparent pricing with no hidden fees on the platform.',
    color: '#ea580c',
    bg: '#fff7ed',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Secure Payments',
    desc: 'End-to-end encrypted transactions for complete peace of mind.',
    color: '#9333ea',
    bg: '#faf5ff',
  },
];

const FeaturesSection = () => {
  return (
    <section className="tk-landing-features" id="features">
      <div className="container">
        <div className="row g-4">
          {features.map((f) => (
            <div className="col-sm-6 col-lg-3" key={f.title}>
              <div className="tk-feature-box">
                <div className="tk-feature-icon-box" style={{ background: f.bg, color: f.color }}>
                  <i className={`bi ${f.icon}`}></i>
                </div>
                <h6 className="fw-bold mt-3">{f.title}</h6>
                <p className="text-muted small mb-0">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
