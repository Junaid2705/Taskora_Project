import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// ============================================================
// PRIVACY POLICY — Static page
// Future developers: edit the content below directly.
// ============================================================

const PrivacyPolicy = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container py-5 flex-grow-1" style={{ maxWidth: 800 }}>
        <h1 className="fw-bold mb-2">Privacy Policy</h1>
        <p className="text-muted mb-4"><strong>Last Updated:</strong> July 2026</p>

        <h4 className="fw-bold mt-4">1. Information We Collect</h4>
        <p>We collect information you provide directly to us when you create an account, complete your profile, post jobs or projects, submit applications, or communicate with other users. This includes:</p>
        <ul>
          <li>Personal information (name, email, phone number)</li>
          <li>Professional information (skills, experience, education, portfolio)</li>
          <li>Usage data (how you interact with our platform)</li>
          <li>Communication data (messages between users)</li>
        </ul>

        <h4 className="fw-bold mt-4">2. How We Use Your Information</h4>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send notifications about activity on your account</li>
          <li>Respond to your comments, questions, and support requests</li>
          <li>Monitor and analyze trends, usage, and activities</li>
        </ul>

        <h4 className="fw-bold mt-4">3. Information Sharing</h4>
        <p>We do not sell your personal information. We share information only in the following circumstances:</p>
        <ul>
          <li>With other users as part of the platform's functionality (e.g., your profile is visible to employers)</li>
          <li>With service providers who assist in operating our platform</li>
          <li>When required by law or to protect rights and safety</li>
        </ul>

        <h4 className="fw-bold mt-4">4. Data Security</h4>
        <p>We implement industry-standard security measures including:</p>
        <ul>
          <li>JWT Authentication for secure access</li>
          <li>BCrypt password encryption</li>
          <li>SSL/TLS encryption for data in transit</li>
          <li>Regular security audits and updates</li>
        </ul>

        <h4 className="fw-bold mt-4">5. Your Rights</h4>
        <p>You have the right to:</p>
        <ul>
          <li>Access, update, or delete your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Request a copy of your data</li>
          <li>Close your account at any time</li>
        </ul>

        <h4 className="fw-bold mt-4">6. Cookies</h4>
        <p>We use essential cookies and local storage for authentication tokens. We do not use third-party tracking cookies. Your login session is stored securely in your browser's local storage.</p>

        <h4 className="fw-bold mt-4">7. Changes to This Policy</h4>
        <p>We may update this Privacy Policy from time to time. We will notify users of significant changes via email or platform notification.</p>

        <h4 className="fw-bold mt-4">8. Contact Us</h4>
        <p>If you have questions about this Privacy Policy, please contact us at <strong>support@taskora.com</strong>.</p>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
