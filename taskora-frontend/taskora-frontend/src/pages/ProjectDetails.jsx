import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ProjectService from '../services/projectService';
import BidService from '../services/bidService';
import { getCurrentUser, getRole } from '../services/auth';
import Avatar from '../components/Avatar';
import { budgetRange, timeAgo, statusPill, money } from '../lib/format';

const Row = ({ label, value }) => (
  <div className="d-flex justify-content-between py-2 border-bottom">
    <span className="text-muted small">{label}</span>
    <span className="fw-semibold small text-end">{value || '—'}</span>
  </div>
);

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getCurrentUser() || {};
  const isEmployer = getRole() === 'ROLE_EMPLOYER';
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [bid, setBid] = useState({ proposal: '', bidAmount: '', deliveryDays: '' });
  const [bidMsg, setBidMsg] = useState('');
  const [alreadyBid, setAlreadyBid] = useState(false);

  const isOwner = project && project.user && project.user.userId === user.id;

  const loadBids = () => BidService.getBidsForProject(id).then((r) => setBids(r.data)).catch(() => {});

  useEffect(() => {
    ProjectService.getProject(id)
      .then((r) => { setProject(r.data); if (r.data.user?.userId === user.id) loadBids(); })
      .catch(() => setErr('Project not found.'))
      .finally(() => setLoading(false));
    // Check if user already bid
    if (!isEmployer) {
      BidService.checkBid(id)
        .then((r) => setAlreadyBid(r.data.bid === true))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitBid = async (e) => {
    e.preventDefault();
    setBidMsg('');
    try {
      await BidService.submitBid({
        projectId: Number(id),
        proposal: bid.proposal,
        bidAmount: Number(bid.bidAmount),
        deliveryDays: bid.deliveryDays ? Number(bid.deliveryDays) : null,
      });
      setBidMsg('success');
      setBid({ proposal: '', bidAmount: '', deliveryDays: '' });
    } catch (e2) {
      setBidMsg(e2.response?.data?.error || 'Could not submit bid.');
    }
  };

  const accept = async (bidId) => { await BidService.acceptBid(bidId); loadBids(); ProjectService.getProject(id).then((r) => setProject(r.data)); };
  const reject = async (bidId) => { await BidService.rejectBid(bidId); loadBids(); };

  const onDelete = async () => {
    if (!window.confirm('Delete this project?')) return;
    try { await ProjectService.deleteProject(id); navigate('/projects'); } catch { alert('Could not delete.'); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (err) return <div className="tk-card tk-empty"><i className="bi bi-exclamation-circle d-block mb-2"></i>{err}</div>;

  return (
    <div>
      <Link to="/projects" className="d-inline-flex align-items-center gap-1 mb-3 fw-semibold">
        <i className="bi bi-arrow-left"></i> Back to Projects
      </Link>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="tk-card tk-card-pad">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <h4 className="fw-bold mb-1">{project.projectTitle}</h4>
              <span className={`tk-pill ${statusPill(project.projectStatus)}`}>{project.projectStatus}</span>
            </div>
            <div className="text-muted mb-3">Posted by {project.user?.fullName || project.user?.username} · {timeAgo(project.createdAt)}</div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className="tk-pill tk-pill-primary">{budgetRange(project.budget)}</span>
              {project.duration && <span className="tk-pill"><i className="bi bi-clock"></i>{project.duration}</span>}
              {project.category && <span className="tk-pill">{project.category.categoryName}</span>}
            </div>
            <hr className="my-3" />
            <h6 className="fw-bold">Project Description</h6>
            <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{project.description || 'No description provided.'}</p>
          </div>

          {/* Bids section for the owner */}
          {isOwner && (
            <div className="tk-card tk-card-pad mt-3">
              <h6 className="fw-bold mb-3">Bids ({bids.length})</h6>
              {bids.length === 0 ? <p className="text-muted small mb-0">No bids yet.</p> : (
                <div className="d-flex flex-column gap-3">
                  {bids.map((b) => (
                    <div key={b.bidId} className="border rounded p-3">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div className="d-flex gap-2 align-items-center">
                          <Avatar name={b.freelancer?.fullName || b.freelancer?.username} size={36} />
                          <div>
                            <div className="fw-semibold">{b.freelancer?.fullName || b.freelancer?.username}</div>
                            <div className="text-muted small">{money(b.bidAmount)} · {b.deliveryDays || '—'} days</div>
                          </div>
                        </div>
                        <span className={`tk-pill ${statusPill(b.status)}`}>{b.status}</span>
                      </div>
                      {b.proposal && <p className="text-muted small mt-2 mb-2">{b.proposal}</p>}
                      {b.status === 'PENDING' && project.projectStatus === 'OPEN' && (
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary" onClick={() => accept(b.bidId)}>Accept</button>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => reject(b.bidId)}>Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {isOwner ? (
            <div className="tk-card tk-card-pad">
              <h6 className="fw-bold mb-3">Manage Project</h6>
              <button className="btn btn-outline-primary w-100" onClick={onDelete}>Delete Project</button>
            </div>
          ) : !isEmployer && project.projectStatus === 'OPEN' ? (
            alreadyBid ? (
              <div className="tk-card tk-card-pad">
                <h6 className="fw-bold mb-3">Your Bid</h6>
                <div className="alert alert-success py-2 mb-0 d-flex align-items-center gap-2">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>You have already submitted a bid for this project.</span>
                </div>
              </div>
            ) : (
            <div className="tk-card tk-card-pad">
              <h6 className="fw-bold mb-3">Submit a Bid</h6>
              {bidMsg === 'success' && <div className="alert alert-success py-2 small">Bid submitted!</div>}
              {bidMsg && bidMsg !== 'success' && <div className="alert alert-danger py-2 small">{bidMsg}</div>}
              <form onSubmit={submitBid}>
                <div className="mb-2">
                  <label className="form-label">Proposal</label>
                  <textarea className="form-control" rows="4" value={bid.proposal}
                    onChange={(e) => setBid({ ...bid, proposal: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Bid Amount ($)</label>
                  <input type="number" className="form-control" value={bid.bidAmount}
                    onChange={(e) => setBid({ ...bid, bidAmount: e.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Delivery (days)</label>
                  <input type="number" className="form-control" value={bid.deliveryDays}
                    onChange={(e) => setBid({ ...bid, deliveryDays: e.target.value })} />
                </div>
                <button className="btn btn-primary w-100">Submit Bid</button>
              </form>
            </div>
            )
          ) : (
            <div className="tk-card tk-card-pad">
              <h6 className="fw-bold mb-3">Project Details</h6>
              <Row label="Budget" value={budgetRange(project.budget)} />
              <Row label="Duration" value={project.duration} />
              <Row label="Status" value={project.projectStatus} />
            </div>
          )}
          {!isOwner && (
            <div className="tk-card tk-card-pad mt-3">
              <Link to={`/report?type=Project&target=${project.user?.userId || ''}`} className="btn btn-outline-danger btn-sm w-100">
                <i className="bi bi-flag me-1"></i>Report this Project
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
