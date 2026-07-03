import React, { useEffect, useState } from 'react';
import SubscriptionService from '../../services/subscriptionService';
import { money } from '../../lib/format';

const CreatorPlan = () => {
  const [currentFee, setCurrentFee] = useState(null);
  const [feeInput, setFeeInput] = useState('');
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeMsg, setFeeMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SubscriptionService.getMyPlan()
      .then((r) => {
        setCurrentFee(r.data.subscriptionFee);
        setFeeInput(r.data.subscriptionFee || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveFee = async () => {
    setFeeMsg('');
    setFeeLoading(true);
    try {
      const fee = parseFloat(feeInput) || 0;
      if (currentFee === null || currentFee === 0) {
        await SubscriptionService.createPlan(fee);
      } else {
        await SubscriptionService.updatePlan(fee);
      }
      setCurrentFee(fee);
      setFeeMsg('Subscription fee saved!');
      setTimeout(() => setFeeMsg(''), 3000);
    } catch (err) {
      setFeeMsg(err.response?.data?.error || 'Failed to save fee.');
    } finally {
      setFeeLoading(false);
    }
  };

  const deletePlan = async () => {
    if (!window.confirm('Deactivate your subscription plan?')) return;
    setFeeLoading(true);
    try {
      await SubscriptionService.deletePlan();
      setCurrentFee(null);
      setFeeInput('');
      setFeeMsg('Plan deactivated.');
      setTimeout(() => setFeeMsg(''), 3000);
    } catch {
      setFeeMsg('Failed.');
    } finally {
      setFeeLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 className="tk-page-title mb-3">
        <i className="bi bi-currency-dollar me-2 text-success"></i>My Subscription Plan
      </h2>

      <div className="tk-card tk-card-pad mb-4">
        <h6 className="fw-bold mb-3"><i className="bi bi-gear me-2 text-primary"></i>Plan Settings</h6>
        {feeMsg && <div className="alert alert-info py-2 small mb-3">{feeMsg}</div>}

        <div className="d-flex align-items-center gap-3 flex-wrap mb-3">
          <div>
            <span className="text-muted small me-2">Current Fee:</span>
            <span className="fw-bold text-success fs-4">
              {currentFee != null && currentFee > 0 ? money(currentFee) + '/mo' : 'Not set'}
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="input-group" style={{ maxWidth: 200 }}>
            <span className="input-group-text">$</span>
            <input
              type="number"
              className="form-control"
              placeholder="9.99"
              value={feeInput}
              onChange={(e) => setFeeInput(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <button className="btn btn-primary" onClick={saveFee} disabled={feeLoading}>
            <i className="bi bi-check-lg me-1"></i>{currentFee ? 'Update Fee' : 'Create Plan'}
          </button>
          {currentFee != null && currentFee > 0 && (
            <button className="btn btn-outline-danger" onClick={deletePlan} disabled={feeLoading}>
              <i className="bi bi-trash me-1"></i>Deactivate Plan
            </button>
          )}
        </div>

        <p className="text-muted small mt-3 mb-0">
          This is the fixed monthly price subscribers will pay. They cannot change it.
        </p>
      </div>

      <div className="tk-card tk-card-pad">
        <h6 className="fw-bold mb-2"><i className="bi bi-info-circle me-2 text-primary"></i>How it works</h6>
        <ul className="text-muted small mb-0">
          <li>Set your monthly subscription fee above</li>
          <li>Users browse creators and subscribe at your set price</li>
          <li>Track your subscribers and revenue in the Subscribers page</li>
          <li>You can update or deactivate your plan at any time</li>
        </ul>
      </div>
    </div>
  );
};

export default CreatorPlan;
