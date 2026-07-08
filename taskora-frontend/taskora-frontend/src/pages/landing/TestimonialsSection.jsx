import React, { useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Freelance Developer',
    text: 'Taskora completely transformed how I find work. The bidding system is transparent, and the real-time messaging makes collaboration seamless. I landed my first $5K project within a week!',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Startup Founder',
    text: 'As an employer, finding quality talent was always a challenge. Taskora\'s verified freelancer profiles and portfolio system make hiring decisions so much easier and confident.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Content Creator',
    text: 'The subscription monetization feature is a game changer. I set my own pricing, and the revenue tracking dashboard gives me complete visibility over my earnings.',
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="tk-landing-testimonials" id="testimonials">
      <div className="container">
        <div className="text-center mb-5">
          <p className="tk-landing-subtitle">Testimonials</p>
          <h2 className="tk-section-title">Don't take our word, see what our users say</h2>
        </div>

        <div className="tk-testimonial-box">
          <div className="tk-testimonial-quote">
            <i className="bi bi-quote tk-quote-icon"></i>
            <p className="tk-testimonial-text">{t.text}</p>
            <div className="tk-testimonial-stars">
              {[...Array(t.rating)].map((_, i) => (
                <i key={i} className="bi bi-star-fill text-warning"></i>
              ))}
            </div>
            <div className="tk-testimonial-author">
              <div className="tk-testimonial-avatar">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="fw-bold">{t.name}</div>
                <div className="text-muted small">{t.role}</div>
              </div>
            </div>
          </div>

          <div className="tk-testimonial-nav">
            <button onClick={prev} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-chevron-left"></i>
            </button>
            <span className="text-muted small">{current + 1} / {testimonials.length}</span>
            <button onClick={next} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
