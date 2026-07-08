import React from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';

const Footer = () => {
  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="tk-footer">
      <div className="container">
        <div className="row gy-4">
          {/* Brand + description */}
          <div className="col-lg-4 col-md-6">
            <Brand to={null} />
            <p className="text-muted small mt-3" style={{ maxWidth: 300 }}>
              Taskora is a freelancer social networking platform connecting professionals, 
              employers, and creators to collaborate and grow together.
            </p>
            <div className="d-flex gap-2 mt-3">
              <a href="#" className="tk-social-icon"><i className="bi bi-facebook"></i></a>
              <a href="#" className="tk-social-icon"><i className="bi bi-linkedin"></i></a>
              <a href="#" className="tk-social-icon"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="tk-social-icon"><i className="bi bi-instagram"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled tk-footer-links">
              <li><a href="#about" onClick={(e) => scrollTo(e, '#about')}>About Us</a></li>
              <li><a href="#services" onClick={(e) => scrollTo(e, '#services')}>Services</a></li>
              <li><a href="#how-it-works" onClick={(e) => scrollTo(e, '#how-it-works')}>How It Works</a></li>
              <li><a href="#testimonials" onClick={(e) => scrollTo(e, '#testimonials')}>Testimonials</a></li>
              <li><a href="#faq" onClick={(e) => scrollTo(e, '#faq')}>FAQ</a></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3">Platform</h6>
            <ul className="list-unstyled tk-footer-links">
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/login">Log In</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-3">Contact</h6>
            <ul className="list-unstyled tk-footer-links">
              <li><i className="bi bi-envelope me-2 text-primary"></i>support@taskora.com</li>
              <li><i className="bi bi-geo-alt me-2 text-primary"></i>Mumbai, India</li>
              <li><i className="bi bi-telephone me-2 text-primary"></i>+91 9000 000 000</li>
            </ul>
          </div>
        </div>

        <hr className="my-4" />
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <p className="text-muted small mb-0">© {new Date().getFullYear()} Taskora. All rights reserved.</p>
          <p className="text-muted small mb-0">Built with ❤️ for professionals worldwide</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
