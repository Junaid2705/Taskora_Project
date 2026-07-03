import React, { useEffect, useState } from 'react';
import SubscriptionService from '../../services/subscriptionService';
import { money } from '../../lib/format';

const CreatorSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SubscriptionService.getMySubscribers()
      .then((r) => setSubscribers(r.data))
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = subscribers
    .filter((s) => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + parseFloat(s.monthlyPrice || 0), 0);
  const activeCount = subscribers.filter((s) => s.status === 'ACTIVE').length;

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 className="tk-page-title mb-3">
        <i className="bi bi-people-fill me-2 text-purple"></i>My Subscribers
      </h2>

      {/* Revenue Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold text-primary">{activeCount}</div>
            <div className="text-muted small">Active Subscribers</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold text-success">{money(totalRevenue)}</div>
            <div className="text-muted small">Monthly Revenue</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="tk-card tk-card-pad text-center">
            <div className="fs-3 fw-bold text-warning">{money(totalRevenue * 12)}</div>
            <div className="text-muted small">Projected Yearly</div>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      {subscribers.length === 0 ? (
        <div className="tk-card tk-empty py-5 text-center">
          <i className="bi bi-people d-block mb-2" style={{ fontSize: '2.5rem' }}></i>
          <p className="mb-2">No subscribers yet.</p>
          <p className="text-muted small">Set up your subscription plan and start creating content to attract subscribers!</p>
        </div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">Subscriber</th>
                <th>Monthly Price</th>
                <th>Status</th>
                <th>Since</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.subscriptionId}>
                  <td className="ps-3 fw-semibold">{s.subscriberName}</td>
                  <td>{money(s.monthlyPrice)}/mo</td>
                  <td>
                    <span className={`tk-pill ${s.status === 'ACTIVE' ? 'tk-pill-green' : 'tk-pill-gray'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="text-muted small">{s.startDate}</td>
                  <td className="text-muted small">{s.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CreatorSubscribers;
