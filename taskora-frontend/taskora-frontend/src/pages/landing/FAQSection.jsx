import React, { useState } from 'react';

const faqs = [
  {
    q: 'How do I get started as a freelancer?',
    a: 'Simply register with your email, choose "Freelancer" as your role, complete your profile with skills and experience, and start browsing jobs or bidding on projects.',
  },
  {
    q: 'Is Taskora free to use?',
    a: 'Yes! Creating an account, browsing jobs, posting projects, and messaging are all free. Creators can monetize through subscription plans with custom pricing.',
  },
  {
    q: 'How does the bidding system work?',
    a: 'Employers post projects with a budget and description. Freelancers submit proposals with their bid amount and delivery timeline. The employer reviews and accepts the best bid.',
  },
  {
    q: 'Can I use Taskora on my mobile phone?',
    a: 'Absolutely! Taskora is fully responsive and works seamlessly on smartphones, tablets, and desktop computers with a mobile-first design approach.',
  },
  {
    q: 'How do creator subscriptions work?',
    a: 'Creators set a monthly subscription fee. Subscribers pay that fixed fee to access the creator\'s content and updates. Creators can track revenue and manage subscribers from their dashboard.',
  },
  {
    q: 'Is my data secure on Taskora?',
    a: 'Yes. We use JWT authentication, BCrypt password encryption, SSL encryption, and follow industry-standard security practices to protect your data.',
  },
];

const FAQSection = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const toggle = (idx) => setOpenIdx(openIdx === idx ? null : idx);

  return (
    <section className="tk-landing-faq" id="faq">
      <div className="container">
        <div className="text-center mb-5">
          <p className="tk-landing-subtitle">FAQ</p>
          <h2 className="tk-section-title">Frequently asked questions</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="tk-faq-list">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`tk-faq-item ${openIdx === idx ? 'open' : ''}`}>
                  <button className="tk-faq-question" onClick={() => toggle(idx)}>
                    <span>{faq.q}</span>
                    <i className={`bi ${openIdx === idx ? 'bi-dash' : 'bi-plus'}`}></i>
                  </button>
                  {openIdx === idx && (
                    <div className="tk-faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
