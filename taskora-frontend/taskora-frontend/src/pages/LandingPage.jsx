import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-light">
      {/* Hero Section - Clean, Spacious, Typography-Focused */}
      <section className="bg-white text-center py-5 border-bottom">
        <div className="container py-5 my-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold text-dark mb-4 tracking-tight">
                Connect, Collaborate, and <span className="text-primary">Grow with Taskora</span>
              </h1>
              <p className="lead text-muted mb-5 px-md-5">
                The ultimate social networking platform designed specifically for freelancers, 
                employers, and creators to build their professional future.
              </p>
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                <Link to="/register" className="btn btn-primary btn-lg px-5">
                  Join the Network
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg px-5">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Utilizing our new custom card styles */}
      <section className="py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Platform Features</h2>
            <p className="text-muted">Everything you need to manage your freelance career.</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 p-2">
                <div className="card-body">
                  <div className="bg-light text-primary d-inline-block p-3 rounded-circle mb-4">
                    <i className="bi bi-person-badge fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Professional Profiles</h4>
                  <p className="text-muted mb-0">
                    Showcase your skills, experience, and portfolio in a clean, professional format tailored for modern freelancers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 p-2">
                <div className="card-body">
                  <div className="bg-light text-primary d-inline-block p-3 rounded-circle mb-4">
                    <i className="bi bi-briefcase fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Job Bidding</h4>
                  <p className="text-muted mb-0">
                    Find high-quality projects posted by verified employers and submit your proposals seamlessly through our system.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 p-2">
                <div className="card-body">
                  <div className="bg-light text-primary d-inline-block p-3 rounded-circle mb-4">
                    <i className="bi bi-chat-square-text fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Social Feed</h4>
                  <p className="text-muted mb-0">
                    Network with other professionals, share daily updates, and grow your audience in a dedicated professional community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;