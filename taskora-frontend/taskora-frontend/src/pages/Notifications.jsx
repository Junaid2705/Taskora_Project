import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../services/auth';
import { timeAgo } from '../lib/format';

const API = 'http://localhost:8081/api/notifications';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API, { headers: authHeader() })
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
    // Mark all read when page opens
    axios.put(API + '/mark-read', {}, { headers: authHeader() }).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 className="tk-page-title mb-3">Notifications</h2>
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-bell d-block mb-2"></i>No notifications yet.</div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {items.map((n) => (
            <div key={n.notificationId} className={`tk-card tk-card-pad ${!n.isRead ? 'border-start border-primary border-3' : ''}`}>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <div className="fw-semibold">{n.title}</div>
                  <div className="text-muted small">{n.description}</div>
                </div>
                <span className="text-muted small text-nowrap ms-3">{timeAgo(n.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
