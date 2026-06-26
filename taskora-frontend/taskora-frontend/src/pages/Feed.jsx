import React, { useEffect, useRef, useState } from 'react';
import PostService from '../services/postService';
import { getCurrentUser } from '../services/auth';
import Avatar from '../components/Avatar';
import { timeAgo } from '../lib/format';

const Feed = () => {
  const me = getCurrentUser() || {};
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const imgRef = useRef();

  const load = (pageNum = 0, append = false) => {
    setLoading(true);
    PostService.getFeed(pageNum, 10).then((r) => {
      const newPosts = r.data;
      setPosts(prev => append ? [...prev, ...newPosts] : newPosts);
      setHasMore(newPosts.length >= 10);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasMore && !loading) {
        const nextPage = page + 1;
        setPage(nextPage);
        load(nextPage, true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, hasMore, loading]);

  const submitPost = async (e) => {
    e.preventDefault();
    if (!newContent.trim() && !newImage) return;
    setPosting(true);
    try {
      await PostService.create(newContent, newImage);
      setNewContent(''); setNewImage(null); if (imgRef.current) imgRef.current.value = '';
      setPage(0);
      load(0, false);
    } catch { /* ignore */ }
    finally { setPosting(false); }
  };

  const toggleLike = async (postId) => {
    const r = await PostService.toggleLike(postId);
    setPosts((prev) => prev.map((p) => p.postId === postId ? { ...p, liked: r.data.liked, likeCount: r.data.likeCount } : p));
  };

  const toggleComments = async (postId) => {
    if (expanded[postId]) {
      setExpanded((e) => ({ ...e, [postId]: false }));
    } else {
      const r = await PostService.getComments(postId);
      setComments((c) => ({ ...c, [postId]: r.data }));
      setExpanded((e) => ({ ...e, [postId]: true }));
    }
  };

  const addComment = async (postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;
    const r = await PostService.addComment(postId, text.trim());
    setComments((c) => ({ ...c, [postId]: [...(c[postId] || []), r.data] }));
    setCommentText((t) => ({ ...t, [postId]: '' }));
    setPosts((prev) => prev.map((p) => p.postId === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p));
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    await PostService.delete(postId);
    setPosts((prev) => prev.filter((p) => p.postId !== postId));
  };

  const startEdit = (post) => {
    setEditingPost(post.postId);
    setEditContent(post.content || '');
  };

  const saveEdit = async (postId) => {
    try {
      await PostService.update(postId, editContent);
      setPosts((prev) => prev.map((p) => p.postId === postId ? { ...p, content: editContent } : p));
      setEditingPost(null);
      setEditContent('');
    } catch { /* ignore */ }
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <h2 className="tk-page-title mb-3">Feed</h2>

      {/* Compose */}
      <div className="tk-card tk-card-pad mb-4">
        <form onSubmit={submitPost}>
          <div className="d-flex gap-3 mb-2">
            <Avatar src={me.avatar} name={me.username} size={42} />
            <textarea className="form-control" rows="2" placeholder="What's on your mind?"
              value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <label className="btn btn-sm btn-outline-secondary mb-0 cursor-pointer">
              <i className="bi bi-image me-1"></i>Photo
              <input type="file" accept="image/*" hidden ref={imgRef}
                onChange={(e) => setNewImage(e.target.files[0])} />
            </label>
            <button className="btn btn-primary btn-sm px-3" disabled={posting || (!newContent.trim() && !newImage)}>
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
          {newImage && <div className="text-muted small mt-2"><i className="bi bi-paperclip"></i> {newImage.name}</div>}
        </form>
      </div>

      {/* Posts */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : posts.length === 0 ? (
        <div className="tk-card tk-empty"><i className="bi bi-newspaper d-block mb-2"></i>No posts yet. Be the first!</div>
      ) : posts.map((p) => (
        <div key={p.postId} className="tk-card tk-card-pad mb-3">
          <div className="d-flex gap-3">
            <Avatar src={p.avatarUrl} name={p.fullName || p.username} size={42} />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <div>
                  <span className="fw-semibold">{p.fullName || p.username}</span>
                  <span className="text-muted small ms-2">@{p.username}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">{timeAgo(p.createdAt)}</span>
                  {p.userId === me.id && (
                    <>
                      <button className="btn btn-sm btn-link text-muted p-0" onClick={() => startEdit(p)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-sm btn-link text-muted p-0" onClick={() => deletePost(p.postId)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}
                </div>
              </div>
              {editingPost === p.postId ? (
                <div className="mt-2">
                  <textarea className="form-control mb-2" rows="3" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => saveEdit(p.postId)}>Save</button>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingPost(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  {p.content && <p className="mt-2 mb-2" style={{ whiteSpace: 'pre-wrap' }}>{p.content}</p>}
                </>
              )}
              {p.imageUrl && <img src={p.imageUrl} alt="" className="rounded w-100 mb-2" style={{ maxHeight: 400, objectFit: 'cover' }} />}
              <div className="d-flex gap-4 mt-2">
                <button className={`btn btn-sm btn-link p-0 text-decoration-none ${p.liked ? 'text-primary fw-bold' : 'text-muted'}`}
                  onClick={() => toggleLike(p.postId)}>
                  <i className={`bi ${p.liked ? 'bi-heart-fill' : 'bi-heart'} me-1`}></i>{p.likeCount || 0}
                </button>
                <button className="btn btn-sm btn-link p-0 text-decoration-none text-muted"
                  onClick={() => toggleComments(p.postId)}>
                  <i className="bi bi-chat me-1"></i>{p.commentCount || 0}
                </button>
              </div>

              {/* Comments section */}
              {expanded[p.postId] && (
                <div className="mt-3 pt-3 border-top">
                  {(comments[p.postId] || []).map((c) => (
                    <div key={c.commentId} className="d-flex gap-2 mb-2">
                      <Avatar src={c.avatarUrl} name={c.fullName || c.username} size={28} />
                      <div className="small">
                        <span className="fw-semibold">{c.fullName || c.username}</span>
                        <span className="ms-2">{c.comment}</span>
                        <div className="text-muted" style={{ fontSize: '0.72rem' }}>{timeAgo(c.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                  <div className="d-flex gap-2 mt-2">
                    <input className="form-control form-control-sm" placeholder="Write a comment..."
                      value={commentText[p.postId] || ''}
                      onChange={(e) => setCommentText((t) => ({ ...t, [p.postId]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && addComment(p.postId)} />
                    <button className="btn btn-sm btn-primary" onClick={() => addComment(p.postId)}>
                      <i className="bi bi-send"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
