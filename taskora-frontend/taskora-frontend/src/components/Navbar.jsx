import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';
import { isLoggedIn } from '../services/auth';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#services', label: 'Services' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#about', label: 'About' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
];

const Navbar = () => {
  const loggedIn = isLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="tk-navbar sticky-top">
      <div className="container d-flex align-items-center py-2">
        <Brand />

        {/* Desktop nav */}
        <ul className="nav d-none d-lg-flex mx-auto gap-1">
          {navLinks.map(l => (
            <li className="nav-item" key={l.href}>
              <a className="nav-link text-dark fw-medium" href={l.href} onClick={(e) => scrollTo(e, l.href)}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Auth buttons */}
        <div className="ms-auto d-flex align-items-center gap-2">
          {loggedIn ? (
            <Link to="/dashboard" className="btn btn-primary px-3">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-link text-dark fw-semibold text-decoration-none d-none d-sm-inline-block">Log In</Link>
              <Link to="/register" className="btn btn-primary px-3">Get Started</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="btn btn-outline-secondary d-lg-none ms-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="tk-mobile-nav d-lg-none">
          <div className="container pb-3">
            {navLinks.map(l => (
              <a key={l.href} className="tk-mobile-nav-link" href={l.href} onClick={(e) => scrollTo(e, l.href)}>
                {l.label}
              </a>
            ))}
            {!loggedIn && (
              <Link to="/login" className="tk-mobile-nav-link" onClick={() => setMenuOpen(false)}>Log In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
