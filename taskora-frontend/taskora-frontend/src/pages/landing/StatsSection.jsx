import React from 'react';

const stats = [
  { icon: 'bi-people-fill', value: '10,000+', label: 'Active Professionals', color: '#2563eb' },
  { icon: 'bi-briefcase-fill', value: '2,500+', label: 'Jobs Posted Monthly', color: '#16a34a' },
  { icon: 'bi-folder-fill', value: '5,000+', label: 'Projects Completed', color: '#ea580c' },
  { icon: 'bi-star-fill', value: '98%', label: 'Client Satisfaction', color: '#9333ea' },
];

const StatsSection = () => {
  return (
    <section className="tk-landing-stats">
      <div className="container">
        <div className="tk-stats-bar">
          {stats.map((s) => (
            <div className="tk-stat-item" key={s.label}>
              <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '1.5rem' }}></i>
              <div className="tk-stat-value">{s.value}</div>
              <div className="tk-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
