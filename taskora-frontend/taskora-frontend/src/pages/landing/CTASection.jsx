import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="tk-landing-cta">
      <div className="container">
        <div className="tk-cta-box">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <h2 className="fw-bold text-white mb-2">Let's work together</h2>
              <p className="text-white-50 mb-0">
                Join thousands of professionals already growing their careers on Taskora. 
                Whether you're hiring, freelancing, or creating — we've got you covered.
              </p>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link to="/register" className="btn btn-light btn-lg px-4 fw-bold">
                <i className="bi bi-arrow-right-circle me-2"></i>Start a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
