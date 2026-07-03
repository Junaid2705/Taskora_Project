import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SubscriptionService from '../../services/subscriptionService';
import { money } from '../../lib/format';

const CreatorDashboard = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [currentFee, setCurrentFee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      SubscriptionService.getMySubscribers().then((r) => setSubscribers(r.data)).catch(() => setSubscribers([])),
      SubscriptionService.getMyPlan().then((r) => setCurrentFee(r.data.subscriptionFee)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const activeCount = subscribers.filter((s) => s.status === 'ACTIVE').length;
  const totalRevenue = subscribers
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + parseFloat(s.monthlyPrice || 0), 0);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 className="tk-page-title mb-4">
        <i className="bi bi-palette me-2" style={{ color: '#9333ea' }}></i>Creator Studio
      </h2>

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-md-3">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold text-primary">{activeCount}</div>
            <div className="text-muted small">Subscribers</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold text-success">{money(totalRevenue)}</div>
            <div className="text-muted small">Monthly Revenue</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold text-warning">{money(totalRevenue * 12)}</div>
            <div className="text-muted small">Yearly Projected</div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold" style={{ color: '#9333ea' }}>
              {currentFee != null && currentFee > 0 ? money(currentFee) : '—'}
            </div>
            <div className="text-muted small">Plan Price/mo</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="tk-card tk-card-pad mb-4">
        <h6 className="fw-bold mb-3"><i className="bi bi-lightning me-2 text-warning"></i>Quick Actions</h6>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/feed" className="btn btn-primary btn-sm">
            <i className="bi bi-plus-circle me-1"></i>Create Post
          </Link>
          <Link to="/creator-plan" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-gear me-1"></i>Manage Plan
          </Link>
          <Link to="/creator-subscribers" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-people me-1"></i>View Subscribers
          </Link>
          <Link to="/messages" className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-chat-dots me-1"></i>Messages
          </Link>
        </div>
      </div>

      {/* Recent Subscribers */}
      <div className="tk-card tk-card-pad">
        <h6 className="fw-bold mb-3"><i className="bi bi-people me-2 text-primary"></i>Recent Subscribers</h6>
        {subscribers.length === 0 ? (
          <p className="text-muted small mb-0">No subscribers yet. Create a subscription plan and post engaging content to attract subscribers!</p>
        ) : (
          <div className="d-flex flex-column gap-2">
            {subscribers.slice(0, 5).map((s) => (
              <div key={s.subscriptionId} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <span className="fw-semibold">{s.subscriberName}</span>
                  <span className={`ms-2 tk-pill ${s.status === 'ACTIVE' ? 'tk-pill-green' : 'tk-pill-gray'}`}>{s.status}</span>
                </div>
                <span className="text-muted small">{money(s.monthlyPrice)}/mo</span>
              </div>
            ))}
            {subscribers.length > 5 && (
              <Link to="/creator-subscribers" className="text-primary small fw-semibold mt-1">
                View all {subscribers.length} subscribers →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
