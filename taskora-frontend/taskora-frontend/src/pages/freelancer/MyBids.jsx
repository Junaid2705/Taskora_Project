import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BidService from '../../services/bidService';
import { money, timeAgo, statusPill } from '../../lib/format';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    BidService.getMyBids().then((r) => setBids(r.data)).catch(() => setBids([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this bid?')) return;
    try { await BidService.withdrawBid(id); load(); } catch { alert('Could not withdraw.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">My Bids</h2>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : bids.length === 0 ? (
        <div className="tk-card tk-empty">
          <i className="bi bi-hammer d-block mb-2"></i>You haven't placed any bids yet.
          <div className="mt-3"><Link to="/projects" className="btn btn-primary btn-sm">Browse Projects</Link></div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {bids.map((b) => (
            <div key={b.bidId} className="tk-card tk-card-pad d-flex justify-content-between align-items-center gap-3">
              <div>
                <Link to={`/projects/${b.project?.projectId}`} className="fw-bold text-dark text-decoration-none">
                  {b.project?.projectTitle || 'Project'}
                </Link>
                <div className="text-muted small mt-1">
                  {money(b.bidAmount)} · {b.deliveryDays || '—'} days · {timeAgo(b.createdAt)}
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className={`tk-pill ${statusPill(b.status)}`}>{b.status}</span>
                {b.status === 'PENDING' && (
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => withdraw(b.bidId)}>
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBids;
