import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { authHeader } from '../services/auth';
import MessageService from '../services/messageService';

const REPORT_API = 'http://localhost:8081/api/reports';

const REPORT_TYPES = ['User', 'Post', 'Job', 'Project', 'Message'];

const ReportUser = () => {
  const [params] = useSearchParams();
  const [reportType, setReportType] = useState(params.get('type') || 'User');
  const [reason, setReason] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill target user from URL params
  useEffect(() => {
    const targetId = params.get('target');
    if (targetId) {
      axios.get(`http://localhost:8081/api/users/${targetId}`, { headers: authHeader() })
        .then((r) => {
          setSelectedUser(r.data);
          setSearchQ(r.data.fullName || r.data.username || '');
        })
        .catch(() => {});
    }
  }, [params]);

  const searchUsers = (q) => {
    setSearchQ(q);
    if (q.trim().length < 2) { setSearchResults([]); return; }
    MessageService.searchUsers(q.trim())
      .then((r) => setSearchResults(r.data || []))
      .catch(() => setSearchResults([]));
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setSearchQ(user.fullName || user.username);
    setSearchResults([]);
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');

    if (!selectedUser) { setError('Please select a target user.'); return; }
    if (!reason.trim()) { setError('Please provide a reason.'); return; }

    setSubmitting(true);
    try {
      await axios.post(REPORT_API, {
        targetId: selectedUser.userId,
        reportType,
        reason: reason.trim(),
      }, { headers: authHeader() });
      setMsg('Report submitted successfully. Our team will review it.');
      setReason('');
      setSelectedUser(null);
      setSearchQ('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 className="tk-page-title mb-3">Report a User</h2>
      <p className="text-muted small mb-4">
        If you've encountered inappropriate behavior, please submit a report below. Our moderation team will review it.
      </p>

      {msg && <div className="alert alert-success py-2 small mb-3">{msg}</div>}
      {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

      <form onSubmit={submit}>
        <div className="tk-card tk-card-pad">
          {/* Report Type */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Report Type</label>
            <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
              {REPORT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Target User Search */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Target User</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Search user by name..."
                value={searchQ}
                onChange={(e) => searchUsers(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="position-absolute w-100 bg-white border rounded shadow-sm mt-1" style={{ zIndex: 10, maxHeight: 200, overflowY: 'auto' }}>
                  {searchResults.map((u) => (
                    <div
                      key={u.userId}
                      className="px-3 py-2 d-flex align-items-center gap-2 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                      onClick={() => selectUser(u)}
                    >
                      <i className="bi bi-person-circle text-muted"></i>
                      <span className="fw-semibold">{u.fullName || u.username}</span>
                      <span className="text-muted small ms-auto">@{u.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedUser && (
              <div className="mt-2 small text-success">
                <i className="bi bi-check-circle me-1"></i>
                Selected: <strong>{selectedUser.fullName || selectedUser.username}</strong> (@{selectedUser.username})
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Reason</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Describe the issue in detail..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-danger w-100" disabled={submitting}>
            {submitting ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
            ) : (
              <><i className="bi bi-flag me-2"></i>Submit Report</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportUser;
