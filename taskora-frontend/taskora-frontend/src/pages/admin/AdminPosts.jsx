import React, { useEffect, useState } from 'react';
import AdminService from '../../services/adminService';
import { timeAgo } from '../../lib/format';

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); AdminService.getPosts(0, 100).then(r => setPosts(r.data.content || r.data || [])).catch(() => setPosts([])).finally(() => setLoading(false)); };
  useEffect(load, []);
  const remove = async (id) => { if (!window.confirm('Delete this post?')) return; try { await AdminService.deletePost(id); load(); } catch {} };

  return (
    <div>
      <h2 className="tk-page-title mb-3">Posts Management</h2>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : posts.length === 0 ? <div className="tk-card tk-empty py-5"><i className="bi bi-newspaper d-block mb-2" style={{fontSize:'2rem'}}></i>No posts.</div> : (
        <div className="tk-card overflow-auto">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light"><tr><th className="ps-3">Author</th><th>Content</th><th>Image</th><th>Posted</th><th className="text-end pe-3">Actions</th></tr></thead>
            <tbody>{posts.map(p => (
              <tr key={p.postId}><td className="ps-3 fw-semibold">{p.user?.username || '—'}</td><td className="text-muted small" style={{maxWidth:250,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.content || '—'}</td><td>{p.imageUrl ? <img src={p.imageUrl} alt="" style={{width:40,height:40,objectFit:'cover',borderRadius:6}} /> : '—'}</td><td className="text-muted small">{timeAgo(p.createdAt)}</td><td className="text-end pe-3"><button className="btn btn-sm btn-outline-danger" onClick={() => remove(p.postId)}><i className="bi bi-trash"></i></button></td></tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default AdminPosts;
