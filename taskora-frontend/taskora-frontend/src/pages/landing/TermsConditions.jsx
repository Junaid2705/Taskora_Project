import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// ============================================================
// TERMS & CONDITIONS — Static page
// Future developers: edit the content below directly.
// ============================================================

const TermsConditions = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="container py-5 flex-grow-1" style={{ maxWidth: 800 }}>
        <h1 className="fw-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted mb-4"><strong>Last Updated:</strong> July 2026</p>
        <p>Welcome to Taskora. By accessing or using our platform, you agree to be bound by these Terms and Conditions.</p>

        <h4 className="fw-bold mt-4">1. Acceptance of Terms</h4>
        <p>By registering for an account or using any part of the Taskora platform, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not use the platform.</p>

        <h4 className="fw-bold mt-4">2. User Accounts</h4>
        <ul>
          <li>You must provide accurate and complete information when creating an account</li>
          <li>You are responsible for maintaining the security of your account credentials</li>
          <li>You must be at least 18 years old to use this platform</li>
          <li>One person may not maintain more than one account</li>
        </ul>

        <h4 className="fw-bold mt-4">3. User Roles & Responsibilities</h4>
        <p><strong>Freelancers:</strong> Must deliver work as agreed, maintain professional conduct, and not misrepresent skills or experience.</p>
        <p><strong>Employers:</strong> Must provide clear project/job descriptions, pay agreed amounts, and treat freelancers fairly.</p>
        <p><strong>Creators:</strong> Must provide value to subscribers, not post misleading content, and honor subscription commitments.</p>

        <h4 className="fw-bold mt-4">4. Prohibited Activities</h4>
        <p>Users may not:</p>
        <ul>
          <li>Post false, misleading, or fraudulent content</li>
          <li>Harass, abuse, or threaten other users</li>
          <li>Use the platform for illegal activities</li>
          <li>Attempt to bypass platform fees or payment systems</li>
          <li>Scrape, copy, or redistribute platform content without permission</li>
          <li>Create fake accounts or impersonate others</li>
        </ul>

        <h4 className="fw-bold mt-4">5. Intellectual Property</h4>
        <p>Users retain ownership of content they create. By posting on Taskora, you grant us a non-exclusive license to display and distribute your content within the platform. Work delivered through projects belongs to the party as agreed in the project terms.</p>

        <h4 className="fw-bold mt-4">6. Payments & Subscriptions</h4>
        <ul>
          <li>All subscription fees are set by creators and clearly displayed before purchase</li>
          <li>Subscriptions are billed monthly and can be cancelled at any time</li>
          <li>Refunds are handled on a case-by-case basis</li>
        </ul>

        <h4 className="fw-bold mt-4">7. Account Termination</h4>
        <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may delete their accounts at any time through their profile settings.</p>

        <h4 className="fw-bold mt-4">8. Limitation of Liability</h4>
        <p>Taskora provides the platform as-is. We are not responsible for disputes between users, quality of work delivered, or losses arising from use of the platform.</p>

        <h4 className="fw-bold mt-4">9. Dispute Resolution</h4>
        <p>Any disputes between users should first be attempted to resolve directly. If unresolved, users may report the issue to the admin team for mediation.</p>

        <h4 className="fw-bold mt-4">10. Changes to Terms</h4>
        <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>

        <h4 className="fw-bold mt-4">11. Contact</h4>
        <p>For questions about these Terms, contact us at <strong>support@taskora.com</strong>.</p>
      </div>
      <Footer />
    </div>
  );
};

export default TermsConditions;
