import React from 'react';
import { Link } from 'react-router-dom';

// Taskora wordmark + logo. `to` makes it a link; omit for plain display.
const Brand = ({ to = '/', className = '' }) => {
  const inner = (
    <span className={`tk-brand ${className}`}>
      <img src="/logo 1.png" alt="Taskora" onError={(e) => { e.target.style.display = 'none'; }} />
      {/* <span>Task<span className="tk-brand-accent">ora</span></span> */}
    </span>
  );
  return to ? <Link to={to} style={{ textDecoration: 'none' }}>{inner}</Link> : inner;
};

export default Brand;
