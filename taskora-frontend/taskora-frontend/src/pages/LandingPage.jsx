import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Seo from "../components/Seo";


// 1. IMPORT THE IMAGE HERE (Adjust path or filename if yours is named differently)
import heroImage from "../assets/project-image.png";

const features = [
  {
    icon: "bi-search",
    title: "Find Opportunities",
    text: "Explore jobs and projects tailored for you.",
  },
  {
    icon: "bi-people-fill",
    title: "Build Network",
    text: "Connect with professionals and grow your network.",
  },
  {
    icon: "bi-rocket-takeoff-fill",
    title: "Get Hired",
    text: "Showcase your skills and get hired faster.",
  },
  {
    icon: "bi-shield-check",
    title: "Trusted Platform",
    text: "Secure payments and verified members.",
  },
];

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Seo
        title="Taskora - Connect, Collaborate, Grow"
        description="The ultimate platform for freelancers, employers and professionals to work, connect and grow together."
      />
      <Navbar />

      {/* Hero */}
      <section className="tk-hero">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h1>
                Connect.
                <br />
                <span className="accent">Collaborate.</span>
                <br />
                Grow.
              </h1>
              <p
                className="text-muted fs-5 mt-3 mb-4"
                style={{ maxWidth: 480 }}
              >
                The ultimate platform for freelancers, employers and
                professionals to work, connect and grow together.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn btn-primary btn-lg px-4">
                  Get Started
                </Link>
                <a
                  href="#features"
                  className="btn btn-outline-primary btn-lg px-4"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              {/* 2. USE THE IMPORTED IMAGE VARIABLE HERE & make it responsive with 'img-fluid' */}
              <img
                src={heroImage}
                alt="Taskora Hero Illustration"
                className="img-fluid"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-5">
        <div className="container">
          <h2 className="text-center fw-bold mb-5">Why Choose Taskora?</h2>
          <div className="row g-4">
            {features.map((f) => (
              <div className="col-6 col-lg-3" key={f.title}>
                <div className="tk-card tk-card-pad h-100 text-center">
                  <div className="tk-feature-icon mx-auto mb-3">
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h6 className="fw-bold">{f.title}</h6>
                  <p className="text-muted small mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-grow-1"></div>
      <Footer />
    </div>
  );
};

export default LandingPage;
