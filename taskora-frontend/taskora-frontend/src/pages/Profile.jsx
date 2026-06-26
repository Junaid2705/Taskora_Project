import React, { useEffect, useRef, useState } from 'react';
import ProfileService from '../services/profileService';
import Avatar from '../components/Avatar';
import { getCurrentUser } from '../services/auth';

const Profile = () => {
  const [p, setP] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const [portfolio, setPortfolio] = useState([]);
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '' });
  const [pwdMsg, setPwdMsg] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameMsg, setUsernameMsg] = useState('');
  const avatarRef = useRef();
  const coverRef = useRef();

  const load = () => ProfileService.getProfile().then((r) => { setP(r.data); setForm(r.data); });

  useEffect(() => {
    load();
    ProfileService.getPortfolio().then((r) => setPortfolio(r.data)).catch(() => {});
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const r = await ProfileService.updateProfile(form);
      setP(r.data); setForm(r.data); setEditing(false); setMsg('Profile updated!');
      setTimeout(() => setMsg(''), 2500);
    } catch { setMsg('Could not save profile.'); }
  };

  const cacheAvatar = (url) => {
    const u = getCurrentUser();
    if (u) { u.avatar = url; localStorage.setItem('user', JSON.stringify(u)); }
  };

  const upload = async (e, type) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setMsg('');
    try {
      const r = type === 'avatar' ? await ProfileService.uploadAvatar(file) : await ProfileService.uploadCover(file);
      if (type === 'avatar') cacheAvatar(r.data.url);
      await load();
      setMsg(`${type === 'avatar' ? 'Avatar' : 'Cover'} updated!`);
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setMsg(err.response?.data?.error || 'Upload failed. Please try a JPG/PNG under 10MB.');
    } finally {
      e.target.value = ''; // allow re-selecting the same file
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdMsg('');
    try {
      await ProfileService.changePassword(pwd.currentPassword, pwd.newPassword);
      setPwdMsg('success');
      setPwd({ currentPassword: '', newPassword: '' });
    } catch (e2) {
      setPwdMsg(e2.response?.data?.error || 'Could not change password.');
    }
  };

  const changeUsername = async () => {
    setUsernameMsg('');
    if (!newUsername.trim()) return;
    try {
      const r = await ProfileService.changeUsername(newUsername.trim());
      setUsernameMsg('success');
      setEditingUsername(false);
      const u = getCurrentUser();
      if (u) { u.username = r.data.username; localStorage.setItem('user', JSON.stringify(u)); }
      await load();
      setTimeout(() => setUsernameMsg(''), 2500);
    } catch (e2) {
      setUsernameMsg(e2.response?.data?.message || e2.response?.data?.error || 'Could not change username.');
    }
  };

  const deletePortfolioItem = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await ProfileService.deletePortfolioItem(id);
      setPortfolio((prev) => prev.filter((item) => item.id !== id));
    } catch { /* ignore */ }
  };

  if (!p) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  const skills = (p.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
  const location = [p.city, p.state, p.country].filter(Boolean).join(', ');

  return (
    <div style={{ maxWidth: 900 }}>
      {msg && <div className="alert alert-success py-2 small">{msg}</div>}

      {/* Header card */}
      <div className="tk-card overflow-hidden mb-3">
        <div style={{ height: 160, background: p.coverImage ? `url(${p.coverImage}) center/cover` : 'linear-gradient(120deg,#2563eb,#60a5fa)', position: 'relative' }}>
          <button className="btn btn-sm btn-light position-absolute" style={{ top: 12, right: 12 }} onClick={() => coverRef.current.click()}>
            <i className="bi bi-camera"></i> Cover
          </button>
          <input type="file" accept="image/*" ref={coverRef} hidden onChange={(e) => upload(e, 'cover')} />
        </div>
        <div className="px-4 pb-4">
          <div className="d-flex justify-content-between align-items-end" style={{ marginTop: -40 }}>
            <div className="position-relative">
              <div style={{ border: '4px solid #fff', borderRadius: '50%', background: '#fff' }}>
                <Avatar src={p.avatar} name={p.fullName || p.username} size={88} />
              </div>
              <button className="btn btn-sm btn-primary rounded-circle position-absolute" style={{ bottom: 4, right: 4, width: 30, height: 30, padding: 0 }}
                onClick={() => avatarRef.current.click()}><i className="bi bi-camera"></i></button>
              <input type="file" accept="image/*" ref={avatarRef} hidden onChange={(e) => upload(e, 'avatar')} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>
          <h4 className="fw-bold mt-2 mb-0">
            {p.fullName || p.username}
            {p.emailVerified && <i className="bi bi-patch-check-fill text-primary ms-2" style={{ fontSize: '1rem' }}></i>}
          </h4>
          <div className="text-muted d-flex align-items-center gap-2">
            @{p.username}
            {!editingUsername && (
              <button className="btn btn-sm btn-link text-muted p-0" onClick={() => { setEditingUsername(true); setNewUsername(p.username || ''); }}>
                <i className="bi bi-pencil" style={{ fontSize: '0.8rem' }}></i>
              </button>
            )}
          </div>
          {editingUsername && (
            <div className="d-flex align-items-center gap-2 mt-1">
              <input className="form-control form-control-sm" style={{ maxWidth: 200 }} value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="New username" />
              <button className="btn btn-sm btn-primary" onClick={changeUsername}>Save</button>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingUsername(false)}>Cancel</button>
            </div>
          )}
          {usernameMsg === 'success' && <div className="text-success small mt-1">Username changed!</div>}
          {usernameMsg && usernameMsg !== 'success' && <div className="text-danger small mt-1">{usernameMsg}</div>}
          <div className="text-muted">{p.headline || (p.role || '').replace('ROLE_', '')}</div>
          {location && <div className="text-muted small mt-1"><i className="bi bi-geo-alt me-1"></i>{location}</div>}
        </div>
      </div>

      {editing ? (
        <div className="tk-card tk-card-pad mb-3">
          <h6 className="fw-bold mb-3">Edit Profile</h6>
          <form onSubmit={save}>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Full Name</label><input name="fullName" className="form-control" value={form.fullName || ''} onChange={onChange} /></div>
              <div className="col-md-6"><label className="form-label">Headline</label><input name="headline" className="form-control" value={form.headline || ''} onChange={onChange} /></div>
              <div className="col-12"><label className="form-label">Bio</label><textarea name="bio" rows="3" className="form-control" value={form.bio || ''} onChange={onChange} /></div>
              <div className="col-12"><label className="form-label">Skills (comma separated)</label><input name="skills" className="form-control" value={form.skills || ''} onChange={onChange} /></div>
              <div className="col-md-6"><label className="form-label">Experience</label><textarea name="experience" rows="2" className="form-control" value={form.experience || ''} onChange={onChange} /></div>
              <div className="col-md-6"><label className="form-label">Education</label><textarea name="education" rows="2" className="form-control" value={form.education || ''} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">City</label><input name="city" className="form-control" value={form.city || ''} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">State</label><input name="state" className="form-control" value={form.state || ''} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">Country</label><input name="country" className="form-control" value={form.country || ''} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">Website</label><input name="website" className="form-control" value={form.website || ''} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">LinkedIn</label><input name="linkedin" className="form-control" value={form.linkedin || ''} onChange={onChange} /></div>
              <div className="col-md-4"><label className="form-label">GitHub</label><input name="github" className="form-control" value={form.github || ''} onChange={onChange} /></div>
            </div>
            <button className="btn btn-primary mt-3 px-4">Save Changes</button>
          </form>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="tk-card tk-card-pad mb-3">
              <h6 className="fw-bold">About Me</h6>
              <p className="text-muted mb-0">{p.bio || 'No bio yet. Click Edit Profile to add one.'}</p>
            </div>
            {skills.length > 0 && (
              <div className="tk-card tk-card-pad mb-3">
                <h6 className="fw-bold">Skills</h6>
                <div className="d-flex flex-wrap gap-2">{skills.map((s) => <span key={s} className="tk-skill">{s}</span>)}</div>
              </div>
            )}
            {(p.experience || p.education) && (
              <div className="tk-card tk-card-pad mb-3">
                {p.experience && <><h6 className="fw-bold">Experience</h6><p className="text-muted">{p.experience}</p></>}
                {p.education && <><h6 className="fw-bold mt-2">Education</h6><p className="text-muted mb-0">{p.education}</p></>}
              </div>
            )}
            {/* Portfolio */}
            <div className="tk-card tk-card-pad">
              <h6 className="fw-bold mb-3">Portfolio</h6>
              {portfolio.length === 0 ? <p className="text-muted small mb-0">No portfolio items yet.</p> : (
                <div className="row g-3">
                  {portfolio.map((item) => (
                    <div className="col-6 col-md-4" key={item.id || item.title}>
                      <div className="border rounded overflow-hidden h-100 position-relative">
                        <button className="btn btn-sm btn-danger position-absolute" style={{ top: 4, right: 4, width: 24, height: 24, padding: 0, lineHeight: '24px', fontSize: '0.7rem' }}
                          onClick={() => deletePortfolioItem(item.id)}>
                          <i className="bi bi-x"></i>
                        </button>
                        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-100" style={{ height: 110, objectFit: 'cover' }} />}
                        <div className="p-2">
                          <div className="fw-semibold small">{item.title}</div>
                          {item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noreferrer" className="small">View</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="tk-card tk-card-pad mb-3">
              <h6 className="fw-bold mb-3">Contact & Links</h6>
              <div className="small"><i className="bi bi-envelope me-2 text-muted"></i>{p.email}</div>
              {p.mobile && <div className="small mt-2"><i className="bi bi-telephone me-2 text-muted"></i>{p.mobile}</div>}
              {p.website && <div className="small mt-2"><i className="bi bi-globe me-2 text-muted"></i><a href={p.website} target="_blank" rel="noreferrer">Website</a></div>}
              {p.github && <div className="small mt-2"><i className="bi bi-github me-2 text-muted"></i><a href={p.github} target="_blank" rel="noreferrer">GitHub</a></div>}
              {p.linkedin && <div className="small mt-2"><i className="bi bi-linkedin me-2 text-muted"></i><a href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
            </div>

            <div className="tk-card tk-card-pad">
              <h6 className="fw-bold mb-3">Change Password</h6>
              {pwdMsg === 'success' && <div className="alert alert-success py-2 small">Password changed!</div>}
              {pwdMsg && pwdMsg !== 'success' && <div className="alert alert-danger py-2 small">{pwdMsg}</div>}
              <form onSubmit={changePassword}>
                <input type="password" className="form-control mb-2" placeholder="Current password"
                  value={pwd.currentPassword} onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })} required />
                <input type="password" className="form-control mb-3" placeholder="New password" minLength={6}
                  value={pwd.newPassword} onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })} required />
                <button className="btn btn-outline-primary w-100">Update Password</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
