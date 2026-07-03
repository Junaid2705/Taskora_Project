import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../../services/auth';

const CreatorVerification = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('ID Card');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => {
    axios.get('http://localhost:8081/api/verification/my-requests', { headers: authHeader() })
      .then(r => setRequests(r.data))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return setMsg('Please select a document file.');
    setSubmitting(true); setMsg('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('documentType', docType);
    try {
      await axios.post('http://localhost:8081/api/verification/submit', fd, {
        headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
      });
      setMsg('Document submitted for review!');
      setFile(null);
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    if (status === 'APPROVED') return <span className="badge bg-success">Approved</span>;
    if (status === 'REJECTED') return <span className="badge bg-danger">Rejected</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 className="tk-page-title mb-3"><i className="bi bi-shield-check me-2" style={{ color: '#9333ea' }}></i>Creator Verification</h2>
      <p className="text-muted mb-4">Submit documents to verify your identity as a creator. Admin will review and approve.</p>

      {/* Submit form */}
      <div className="tk-card tk-card-pad mb-4">
        <h6 className="fw-bold mb-3"><i className="bi bi-upload me-2 text-primary"></i>Submit Verification Document</h6>
        {msg && <div className="alert alert-info py-2 small mb-3">{msg}</div>}
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Document Type</label>
            <select className="form-select" value={docType} onChange={e => setDocType(e.target.value)}>
              <option>ID Card</option>
              <option>Passport</option>
              <option>Driver License</option>
              <option>Business Registration</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Upload Document</label>
            <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} accept="image/*,.pdf" />
          </div>
          <button className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      </div>

      {/* Previous requests */}
      <div className="tk-card tk-card-pad">
        <h6 className="fw-bold mb-3"><i className="bi bi-clock-history me-2 text-muted"></i>My Verification Requests</h6>
        {loading ? <div className="text-center py-3"><div className="spinner-border spinner-border-sm" /></div> :
          requests.length === 0 ? <p className="text-muted small mb-0">No verification requests yet.</p> : (
            <div className="d-flex flex-column gap-2">
              {requests.map(r => (
                <div key={r.verificationId} className="border rounded p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{r.documentType}</div>
                    <div className="text-muted small">Submitted {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString() : '—'}</div>
                    {r.remarks && <div className="text-muted small mt-1"><i className="bi bi-chat-left-text me-1"></i>{r.remarks}</div>}
                  </div>
                  {statusBadge(r.status)}
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default CreatorVerification;
