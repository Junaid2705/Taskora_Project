import React from 'react';
import { useLocation } from 'react-router-dom';

// Placeholder for admin sections still under development.
const AdminPlaceholder = () => {
  const { pathname } = useLocation();
  const section = pathname.split('/').pop();
  const name = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ');

  return (
    <div>
      <h2 className="tk-page-title mb-3">{name}</h2>
      <div className="tk-card tk-card-pad text-center py-5">
        <i className="bi bi-wrench text-muted d-block mb-2" style={{ fontSize: '2.5rem' }}></i>
        <h5 className="fw-bold">Coming Soon</h5>
        <p className="text-muted mb-0">This module is under development.</p>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
