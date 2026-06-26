import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { authHeader } from '../../services/auth';

const API = 'http://localhost:8081/api/settings';

const AdminSettings = () => {
  const [form, setForm] = useState({
    siteName: '', logo: '', favicon: '',
    smtpHost: '', smtpPort: '', smtpEmail: '', smtpPassword: '',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API).then((r) => {
      const d = r.data || {};
      setForm({
        siteName: d.siteName || '',
        logo: d.logo || '',
        favicon: d.favicon || '',
        smtpHost: d.smtpHost || '',
        smtpPort: d.smtpPort || '',
        smtpEmail: d.smtpEmail || '',
        smtpPassword: d.smtpPassword || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await axios.put(API, form, { headers: authHeader() });
      setMsg('Settings saved successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch {
      setMsg('Failed to save settings.');
    }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;

  return (
    <div>
      <h2 className="tk-page-title mb-3">Site Settings</h2>
      <div className="tk-card tk-card-pad" style={{ maxWidth: 700 }}>
        {msg && <div className="alert alert-info py-2 small">{msg}</div>}
        <form onSubmit={onSubmit}>
          <h6 className="fw-bold mb-3">General</h6>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">Site Name</label>
              <input name="siteName" className="form-control" value={form.siteName} onChange={onChange} placeholder="Taskora" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Logo URL</label>
              <input name="logo" className="form-control" value={form.logo} onChange={onChange} placeholder="/logo.png" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Favicon URL</label>
              <input name="favicon" className="form-control" value={form.favicon} onChange={onChange} placeholder="/favicon.svg" />
            </div>
          </div>

          <h6 className="fw-bold mb-3">SMTP (Email)</h6>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label">SMTP Host</label>
              <input name="smtpHost" className="form-control" value={form.smtpHost} onChange={onChange} placeholder="smtp.gmail.com" />
            </div>
            <div className="col-md-6">
              <label className="form-label">SMTP Port</label>
              <input name="smtpPort" className="form-control" value={form.smtpPort} onChange={onChange} placeholder="587" />
            </div>
            <div className="col-md-6">
              <label className="form-label">SMTP Email</label>
              <input name="smtpEmail" className="form-control" value={form.smtpEmail} onChange={onChange} placeholder="noreply@taskora.com" />
            </div>
            <div className="col-md-6">
              <label className="form-label">SMTP Password</label>
              <input type="password" name="smtpPassword" className="form-control" value={form.smtpPassword} onChange={onChange} />
            </div>
          </div>

          <button className="btn btn-primary px-4">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
