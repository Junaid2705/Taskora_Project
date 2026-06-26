import React, { useEffect, useState } from 'react';
import SubscriptionService from '../services/subscriptionService';
import { getCurrentUser, getRole } from '../services/auth';
import Avatar from '../components/Avatar';
import { money } from '../lib/format';

const Subscriptions = () => {
  const me = getCurrentUser() || {};
  const role = getRole();
  const isCreator = role === 'ROLE_CREATOR';
  const [tab, setTab] = useState(isCreator ? 'subscribers' : 'subscriptions');
  const [subscriptions, setSubscriptions] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [allCreators, setAllCreators] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  // Creator plan state
  const [currentFee, setCurrentFee] = useState(null);
  const [feeInput, setFeeInput] = useState('');
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeMsg, setFeeMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    const tasks = [
      SubscriptionService.getMySubscriptions().then((r) => setSubscriptions(r.data)).catch(() => setSubscriptions([])),
      SubscriptionService.getAllCreators().then((r) => setAllCreators(r.data)).catch(() => setAllCreators([])),
    ];
    if (isCreator) {
      tasks.push(SubscriptionService.getMySubscribers().then((r) => setSubscribers(r.data)).catch(() => setSubscribers([])));
      tasks.push(SubscriptionService.getMyPlan().then((r) => {
        setCurrentFee(r.data.subscriptionFee);
        setFeeInput(r.data.subscriptionFee || '');
      }).catch(() => {}));
    }
    Promise.all(tasks).finally(() => setLoading(false));
  };

  useEffect(loadData, [isCreator]);

  // Subscribe with one click — uses the creator's fixed fee
  const subscribe = async (creatorId) => {
    setMsg('');
    try {
      await SubscriptionService.subscribe(creatorId, null); // null = use creator's set fee
      setMsg('Subscribed successfully! 🎉');
      loadData();
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Could not subscribe.');
      setTimeout(() => setMsg(''), 4000);
    }
  };

  const unsubscribe = async (creatorId) => {
    if (!window.confirm('Unsubscribe from this creator?')) return;
    try {
      await SubscriptionService.unsubscribe(creatorId);
      loadData();
    } catch { alert('Could not unsubscribe.'); }
  };

  // Creator plan actions
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
    } catch { setFeeMsg('Failed.'); }
    finally { setFeeLoading(false); }
  };

  // Revenue
  const totalRevenue = subscribers.filter((s) => s.status === 'ACTIVE').reduce((sum, s) => sum + parseFloat(s.monthlyPrice || 0), 0);
  const activeCount = subscribers.filter((s) => s.status === 'ACTIVE').length;

  // Filter creators for browse tab (exclude self, filter by search)
  const subscribedIds = new Set(subscriptions.filter(s => s.status === 'ACTIVE').map(s => s.creatorId));
  const filteredCreators = allCreators
    .filter(c => c.userId !== me.id)
    .filter(c => !searchQ || (c.fullName || c.username || '').toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div style={{ maxWidth: 800 }}>
      <h2 className="tk-page-title mb-3">Subscriptions</h2>

      {msg && <div className="alert alert-success py-2 small mb-3">{msg}</div>}

      {/* Creator Plan Management */}
      {isCreator && (
        <div className="tk-card tk-card-pad mb-4">
          <h6 className="fw-bold mb-3"><i className="bi bi-gear me-2 text-primary"></i>Your Subscription Plan</h6>
          {feeMsg && <div className="alert alert-info py-2 small mb-3">{feeMsg}</div>}
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div>
              <span className="text-muted small me-2">Current Fee:</span>
              <span className="fw-bold text-success fs-5">{currentFee != null && currentFee > 0 ? money(currentFee) + '/mo' : 'Not set'}</span>
            </div>
            <div className="input-group" style={{ maxWidth: 180 }}>
              <span className="input-group-text">$</span>
              <input type="number" className="form-control" placeholder="9.99"
                value={feeInput} onChange={(e) => setFeeInput(e.target.value)} min="0" step="0.01" />
            </div>
            <button className="btn btn-primary btn-sm" onClick={saveFee} disabled={feeLoading}>
              <i className="bi bi-check-lg me-1"></i>Save
            </button>
            {currentFee != null && currentFee > 0 && (
              <button className="btn btn-outline-danger btn-sm" onClick={deletePlan} disabled={feeLoading}>
                <i className="bi bi-trash me-1"></i>Deactivate
              </button>
            )}
          </div>
          <p className="text-muted small mt-2 mb-0">
            This is the fixed monthly price subscribers will pay. They won't be able to change it.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="tk-tabs mb-4">
        {!isCreator && <button className={`tk-tab ${tab === 'subscriptions' ? 'active' : ''}`} onClick={() => setTab('subscriptions')}>My Subscriptions</button>}
        {isCreator && <button className={`tk-tab ${tab === 'subscribers' ? 'active' : ''}`} onClick={() => setTab('subscribers')}>My Subscribers</button>}
        <button className={`tk-tab ${tab === 'browse' ? 'active' : ''}`} onClick={() => setTab('browse')}>
          {isCreator ? 'Revenue' : 'Browse Creators'}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <>
          {/* ---- My Subscriptions ---- */}
          {tab === 'subscriptions' && (
            subscriptions.length === 0 ? (
              <div className="tk-card tk-empty py-5">
                <i className="bi bi-star d-block mb-2" style={{ fontSize: '2rem' }}></i>
                <p className="mb-2">You're not subscribed to any creators yet.</p>
                <button className="btn btn-primary btn-sm" onClick={() => setTab('browse')}>Browse Creators</button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {subscriptions.map((s) => (
                  <div key={s.subscriptionId} className="tk-card tk-card-pad d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      <div className="tk-stat-icon" style={{ background: '#f3e8ff', color: '#9333ea' }}><i className="bi bi-person-hearts"></i></div>
                      <div>
                        <div className="fw-bold">{s.creatorName}</div>
                        <div className="text-muted small">
                          {money(s.monthlyPrice)}/mo · {s.status === 'ACTIVE' ? '✅ Active' : '⏸️ Expired'}
                          {s.endDate && <span className="ms-2">· Renews {s.endDate}</span>}
                        </div>
                      </div>
                    </div>
                    {s.status === 'ACTIVE' && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => unsubscribe(s.creatorId)}>Unsubscribe</button>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* ---- My Subscribers (Creator) ---- */}
          {tab === 'subscribers' && isCreator && (
            <div>
              <div className="row g-3 mb-4">
                <div className="col-md-4"><div className="tk-card tk-card-pad text-center"><div className="fs-3 fw-bold text-primary">{activeCount}</div><div className="text-muted small">Active Subscribers</div></div></div>
                <div className="col-md-4"><div className="tk-card tk-card-pad text-center"><div className="fs-3 fw-bold text-success">{money(totalRevenue)}</div><div className="text-muted small">Monthly Revenue</div></div></div>
                <div className="col-md-4"><div className="tk-card tk-card-pad text-center"><div className="fs-3 fw-bold text-warning">{subscribers.length}</div><div className="text-muted small">Total Subscribers</div></div></div>
              </div>
              {subscribers.length === 0 ? (
                <div className="tk-card tk-empty py-4"><i className="bi bi-people d-block mb-2"></i>No subscribers yet.</div>
              ) : (
                <div className="tk-card overflow-auto">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light"><tr><th className="ps-3">Subscriber</th><th>Price</th><th>Status</th><th>Since</th></tr></thead>
                    <tbody>
                      {subscribers.map((s) => (
                        <tr key={s.subscriptionId}>
                          <td className="ps-3 fw-semibold">{s.subscriberName}</td>
                          <td>{money(s.monthlyPrice)}/mo</td>
                          <td><span className={`tk-pill ${s.status === 'ACTIVE' ? 'tk-pill-green' : 'tk-pill-gray'}`}>{s.status}</span></td>
                          <td className="text-muted small">{s.startDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ---- Browse Creators / Revenue ---- */}
          {tab === 'browse' && (
            isCreator ? (
              <div className="tk-card tk-card-pad">
                <h6 className="fw-bold mb-3"><i className="bi bi-graph-up-arrow me-2 text-success"></i>Revenue Tracking</h6>
                <div className="row g-3">
                  <div className="col-6"><div className="p-3 bg-light rounded text-center"><div className="fs-4 fw-bold">{money(totalRevenue)}</div><div className="text-muted small">Monthly Income</div></div></div>
                  <div className="col-6"><div className="p-3 bg-light rounded text-center"><div className="fs-4 fw-bold">{money(totalRevenue * 12)}</div><div className="text-muted small">Projected Yearly</div></div></div>
                </div>
              </div>
            ) : (
              <div>
                {/* Search bar */}
                <div className="input-group mb-4">
                  <span className="input-group-text bg-white"><i className="bi bi-search text-muted"></i></span>
                  <input className="form-control" placeholder="Search creators..."
                    value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
                </div>

                {/* All creators listed by default */}
                {filteredCreators.length === 0 ? (
                  <div className="tk-card tk-empty py-4"><i className="bi bi-people d-block mb-2"></i>No creators found.</div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {filteredCreators.map((c) => {
                      const isSubscribed = subscribedIds.has(c.userId);
                      const hasPlan = c.subscriptionFee && parseFloat(c.subscriptionFee) > 0;
                      return (
                        <div key={c.userId} className="tk-card tk-card-pad d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <Avatar src={c.avatarUrl} name={c.fullName || c.username} size={50} />
                            <div>
                              <div className="fw-bold">{c.fullName || c.username}</div>
                              <div className="text-muted small">@{c.username} · {c.subscriberCount || 0} subscribers</div>
                              {hasPlan && (
                                <div className="mt-1">
                                  <span className="tk-pill tk-pill-primary fw-bold">{money(c.subscriptionFee)}/mo</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            {isSubscribed ? (
                              <span className="tk-pill tk-pill-green"><i className="bi bi-check-circle me-1"></i>Subscribed</span>
                            ) : hasPlan ? (
                              <button className="btn btn-primary btn-sm px-3" onClick={() => subscribe(c.userId)}>
                                <i className="bi bi-star me-1"></i>Subscribe · {money(c.subscriptionFee)}/mo
                              </button>
                            ) : (
                              <span className="text-muted small">No plan available</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default Subscriptions;
