import React from 'react';
import Brand from './Brand';

const Footer = () => (
  <footer className="bg-white border-top mt-5">
    <div className="container py-4">
      <div className="row gy-3 align-items-center">
        <div className="col-md-6">
          <Brand to={null} />
          <p className="text-muted small mb-0 mt-2">Connect • Collaborate • Grow</p>
        </div>
        <div className="col-md-6 text-md-end small text-muted">
          <span className="me-3">About Us</span>
          <span className="me-3">Privacy Policy</span>
          <span className="me-3">Terms</span>
          <span>Contact</span>
          <div className="mt-2">© {new Date().getFullYear()} Taskora. All rights reserved.</div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
