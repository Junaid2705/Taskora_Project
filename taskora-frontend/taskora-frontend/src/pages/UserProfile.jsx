import React from 'react';
import Sidebar from '../components/Sidebar';

const UserProfile = () => {
  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row">
        {/* Sidebar Column */}
        <div className="col-md-3 col-lg-2 p-0 d-none d-md-block">
          <Sidebar />
        </div>

        {/* Main Content Column */}
        <div className="col-md-9 col-lg-10 p-4 p-lg-5">
          <div className="card border-0 overflow-hidden mb-4 p-0">
            {/* Cover Image */}
            <img 
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop" 
              alt="Cover" 
              className="cover-image"
            />
            
            <div className="card-body px-4 px-md-5 pb-5">
              {/* Profile Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop" 
                  alt="Avatar" 
                  className="rounded-circle avatar-profile bg-white shadow-sm"
                />
                <div className="mt-4 mt-md-0 d-flex gap-2">
                  <button className="btn btn-outline-primary px-4 fw-medium">Edit Profile</button>
                  <button className="btn btn-primary px-4 fw-medium">View Portfolio</button>
                </div>
              </div>

              {/* User Info */}
              <h2 className="fw-bold mb-1 text-dark">
                John Doe <i className="bi bi-patch-check-fill text-primary ms-1 fs-4 align-middle"></i>
              </h2>
              <p className="text-muted fs-5 mb-2">Senior Full Stack Developer</p>
              <p className="text-secondary fw-medium mb-4">
                <i className="bi bi-geo-alt-fill me-1"></i> San Francisco, USA
              </p>

              {/* Stats Row */}
              <div className="d-flex flex-wrap gap-4 gap-md-5 mb-5 border-top border-bottom py-4">
                <div>
                  <h4 className="fw-bold mb-0 text-dark">120</h4>
                  <span className="text-muted fw-medium small text-uppercase">Projects</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">85</h4>
                  <span className="text-muted fw-medium small text-uppercase">Connections</span>
                </div>
                <div>
                  <h4 className="fw-bold mb-0 text-dark">4.9/5</h4>
                  <span className="text-muted fw-medium small text-uppercase">Reviews</span>
                </div>
              </div>

              {/* About Me & Skills */}
              <div className="row">
                <div className="col-lg-8">
                  <h5 className="fw-bold mb-3 text-dark">About Me</h5>
                  <p className="text-muted mb-4 lh-lg">
                    Passionate Full Stack Developer with 5+ years of experience in building modern, scalable web applications. 
                    Specialized in creating robust microservice architectures with Spring Boot and dynamic user interfaces with React.js.
                  </p>

                  <h5 className="fw-bold mb-3 text-dark">Core Skills</h5>
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-light text-dark border px-3 py-2 fw-medium">React.js</span>
                    <span className="badge bg-light text-dark border px-3 py-2 fw-medium">Spring Boot</span>
                    <span className="badge bg-light text-dark border px-3 py-2 fw-medium">MySQL</span>
                    <span className="badge bg-light text-dark border px-3 py-2 fw-medium">REST API</span>
                    <span className="badge bg-light text-dark border px-3 py-2 fw-medium">Docker</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;