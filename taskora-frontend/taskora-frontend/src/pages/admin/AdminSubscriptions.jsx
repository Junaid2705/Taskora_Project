import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { money, timeAgo } from '../../lib/format';

const STATUSES = ['ACTIVE', 'EXPIRED'];

const AdminSubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [msg, setMsg] = useState('');

  const load = () => {
    setLoading(true);
    AdminService.getSubscriptions(0, 100)
      .then((r) => setSubs(r.data.content || r.data || []))
      .catch(() => setSubs([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id, status) => {
    try {
      await AdminService.updateSubscription(id, { status });
      setMsg('Status updated.'); load();
      setTimeout(() => setMsg(''), 2500);
    } catch { setMsg('Failed to update.'); }
  };

  const savePrice = async (id) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) { setMsg('Invalid price.'); return; }
    try {
      await AdminService.updateSubscription(id, { monthlyPrice: price });
      setMsg('Price updated.'); setEditId(null); load();
      setTimeout(() => setMsg(''), 2500);
    } catch { setMsg('Failed to update price.'); }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this subscription permanently?')) return;
    try { await AdminService.deleteSubscription(id); load(); } catch { setMsg('Failed to delete.'); }
  };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Subscriptions Management</h2>
      <p className="text-muted small mb-3">Manage all creator-subscriber relationships, edit pricing, change status, or remove subscriptions.</p>

      {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : subs.length === 0 ? (
        <div className="tk-card tk-empty py-5"><i className="bi bi-star d-block mb-2" style={{ fontSize: '2rem' }}></i>No subscriptions found.</div>
      ) : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="ps-3">ID</th>
                <th>Creator</th>
                <th>Subscriber</th>
                <th>Monthly Price</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
                <th className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.subscriptionId}>
                  <td className="ps-3">#{s.subscriptionId}</td>
                  <td className="fw-semibold">{s.creator?.fullName || s.creator?.username || '—'}</td>
                  <td>{s.subscriber?.fullName || s.subscriber?.username || '—'}</td>
                  <td>
                    {editId === s.subscriptionId ? (
                      <div className="d-flex gap-1 align-items-center">
                        <div className="input-group input-group-sm" style={{ width: 100 }}>
                          <span className="input-group-text">$</span>
                          <input type="number" className="form-control" value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && savePrice(s.subscriptionId)} />
                        </div>
                        <button className="btn btn-xs btn-primary" onClick={() => savePrice(s.subscriptionId)}>✓</button>
                        <button className="btn btn-xs btn-ghost" onClick={() => setEditId(null)}>✕</button>
                      </div>
                    ) : (
                      <span className="cursor-pointer" onClick={() => { setEditId(s.subscriptionId); setEditPrice(s.monthlyPrice || ''); }}>
                        {money(s.monthlyPrice)} <i className="bi bi-pencil text-muted" style={{ fontSize: '0.7rem' }}></i>
                      </span>
                    )}
                  </td>
                  <td>
                    <select className="form-select form-select-sm w-auto" value={s.status}
                      onChange={(e) => changeStatus(s.subscriptionId, e.target.value)}>
                      {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                    </select>
                  </td>
                  <td className="text-muted small">{s.startDate || '—'}</td>
                  <td className="text-muted small">{s.endDate || '—'}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(s.subscriptionId)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
