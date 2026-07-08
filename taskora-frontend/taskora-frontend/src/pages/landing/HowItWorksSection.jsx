import React, { useState } from 'react';

const tabs = [
  {
    key: 'freelancer',
    label: 'For Freelancers',
    icon: 'bi-code-slash',
    steps: [
      { title: 'Create Your Profile', desc: 'Build a professional profile showcasing your skills and experience.' },
      { title: 'Browse & Apply', desc: 'Search jobs and projects. Apply or bid with competitive proposals.' },
      { title: 'Get Hired & Deliver', desc: 'Win projects, deliver quality work, and build your reputation.' },
    ],
  },
  {
    key: 'employer',
    label: 'For Employers',
    icon: 'bi-building',
    steps: [
      { title: 'Post a Job or Project', desc: 'Describe what you need — skills, budget, timeline.' },
      { title: 'Review Applications', desc: 'Browse freelancer profiles, portfolios, and bids.' },
      { title: 'Hire & Collaborate', desc: 'Choose the best fit, communicate in real-time, and manage work.' },
    ],
  },
  {
    key: 'creator',
    label: 'For Creators',
    icon: 'bi-palette',
    steps: [
      { title: 'Build Your Audience', desc: 'Publish posts, share updates, and grow your following.' },
      { title: 'Set Subscription Plans', desc: 'Create monthly plans with custom pricing.' },
      { title: 'Earn & Track Revenue', desc: 'Monitor subscribers, revenue, and engagement metrics.' },
    ],
  },
];

const HowItWorksSection = () => {
  const [active, setActive] = useState('freelancer');
  const activeTab = tabs.find(t => t.key === active);

  return (
    <section className="tk-landing-howitworks" id="how-it-works">
      <div className="container">
        <div className="text-center mb-5">
          <p className="tk-landing-subtitle">How It Works</p>
          <h2 className="tk-section-title">Increasing success with Taskora</h2>
        </div>

        {/* Tabs */}
        <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`btn ${active === t.key ? 'btn-primary' : 'btn-outline-primary'} px-4`}
              onClick={() => setActive(t.key)}
            >
              <i className={`bi ${t.icon} me-2`}></i>{t.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="row g-4 justify-content-center">
          {activeTab.steps.map((step, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="tk-step-card">
                <div className="tk-step-number">{idx + 1}</div>
                <h5 className="fw-bold mt-3">{step.title}</h5>
                <p className="text-muted small mb-0">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
