import React, { useEffect, useRef, useState } from 'react';
import MessageService from '../services/messageService';
import chatSocket from '../services/chatSocket';
import { getCurrentUser, authHeader } from '../services/auth';
import Avatar from '../components/Avatar';
import axios from 'axios';

const formatTime = (ts) => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const Messages = () => {
  const me = getCurrentUser() || {};
  const myId = me.id;
  const [contacts, setContacts] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [results, setResults] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachFile, setAttachFile] = useState(null);
  const fileInputRef = useRef();

  const bodyRef = useRef();
  const activeRef = useRef(null);
  const connectedRef = useRef(false);
  const inputRef = useRef();

  const loadContacts = () => MessageService.getContacts().then((r) => setContacts(r.data || [])).catch(() => {});

  useEffect(() => {
    loadContacts().finally(() => setLoading(false));
    const loadOnline = () => axios.get('http://localhost:8081/api/presence/online')
      .then((r) => setOnlineUsers(new Set(r.data.online || []))).catch(() => {});
    loadOnline();
    const presenceInterval = setInterval(loadOnline, 12000);

    chatSocket.connect(
      (msg) => {
        const a = activeRef.current;
        if (a && msg.senderId === a.userId) {
          setMessages((prev) => (prev.some((m) => m.messageId === msg.messageId) ? prev : [...prev, msg]));
          MessageService.markRead(a.userId).catch(() => {});
        }
        loadContacts();
      },
      (status) => { setConnected(status); connectedRef.current = status; }
    );
    return () => { chatSocket.disconnect(); clearInterval(presenceInterval); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (!connectedRef.current && activeRef.current) {
        MessageService.getConversation(activeRef.current.userId).then((r) => setMessages(r.data)).catch(() => {});
      }
    }, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages]);

  const openChat = (c) => {
    setActive(c); activeRef.current = c; setEditingId(null);
    MessageService.getConversation(c.userId).then((r) => { setMessages(r.data); loadContacts(); }).catch(() => setMessages([]));
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const send = async (e) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !attachFile) || !active) return;

    let content = text.trim();

    // If there's an attached file, upload it and embed the URL
    if (attachFile) {
      try {
        const fd = new FormData();
        fd.append('file', attachFile);
        const uploadRes = await axios.post('http://localhost:8081/api/messages/upload', fd, { headers: authHeader() });
        const imageUrl = uploadRes.data.url;
        content = content ? `${content}\n${imageUrl}` : imageUrl;
      } catch {
        content = content || '📎 (attachment failed)';
      }
      setAttachFile(null);
    }

    setText('');
    try {
      const r = await MessageService.sendMessage(active.userId, content);
      setMessages((prev) => (prev.some((m) => m.messageId === r.data.messageId) ? prev : [...prev, r.data]));
      loadContacts();
    } catch {}
  };

  const startEdit = (m) => { setEditingId(m.messageId); setEditText(m.content); };
  const cancelEdit = () => { setEditingId(null); setEditText(''); };
  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const r = await MessageService.editMessage(id, editText.trim());
      setMessages((prev) => prev.map((m) => m.messageId === id ? { ...m, content: r.data.content } : m));
      cancelEdit();
    } catch {}
  };
  const deleteMsg = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await MessageService.deleteMessage(id); setMessages((prev) => prev.filter((m) => m.messageId !== id)); } catch {}
  };

  const runSearch = (q) => {
    setSearchQ(q);
    if (q.trim().length < 1) { setResults([]); return; }
    MessageService.searchUsers(q.trim()).then((r) => setResults(r.data)).catch(() => setResults([]));
  };
  const startChat = (u) => {
    setShowSearch(false); setSearchQ(''); setResults([]);
    openChat({ userId: u.userId, username: u.username, fullName: u.fullName, avatarUrl: u.avatarUrl });
  };

  const isOnline = (username) => onlineUsers.has(username);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="tk-page-title">Messages</h2>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-1">
            <span className="tk-status-dot" style={{ background: connected ? '#22c55e' : '#94a3b8' }}></span>
            <span className="small fw-medium" style={{ color: connected ? '#16a34a' : '#94a3b8' }}>{connected ? 'Connected' : 'Reconnecting...'}</span>
          </div>
          <button className="btn btn-primary btn-sm px-3" onClick={() => setShowSearch(true)}>
            <i className="bi bi-pencil-square me-1"></i>New Chat
          </button>
        </div>
      </div>

      <div className="tk-card tk-chat-container">
        {/* ---- Contact List ---- */}
        <div className={`tk-chat-sidebar ${active ? 'hide-mobile' : ''}`}>
          <div className="tk-chat-sidebar-header">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-transparent border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input className="form-control border-start-0 bg-transparent" placeholder="Search conversations..." />
            </div>
          </div>
          <div className="tk-chat-sidebar-body">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border spinner-border-sm text-primary" /></div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-5 px-3">
                <div className="tk-chat-empty-icon"><i className="bi bi-chat-heart"></i></div>
                <p className="text-muted small mt-2 mb-0">No conversations yet.<br/>Start one with "New Chat".</p>
              </div>
            ) : contacts.map((c) => (
              <div key={c.userId} className={`tk-contact-item ${active?.userId === c.userId ? 'active' : ''}`} onClick={() => openChat(c)}>
                <div className="tk-contact-avatar">
                  <Avatar src={c.avatarUrl} name={c.fullName || c.username} size={46} />
                  {isOnline(c.username) && <span className="tk-contact-online"></span>}
                </div>
                <div className="tk-contact-info">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="tk-contact-name">{c.fullName || c.username}</span>
                    {c.unread > 0 && <span className="tk-unread-badge">{c.unread}</span>}
                  </div>
                  <span className="tk-contact-status">{isOnline(c.username) ? '● Active now' : 'Offline'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Chat Area ---- */}
        <div className="tk-chat-main">
          {!active ? (
            <div className="tk-chat-empty">
              <div className="tk-chat-empty-icon-lg"><i className="bi bi-chat-dots"></i></div>
              <h5 className="fw-bold mt-3">Your Messages</h5>
              <p className="text-muted">Select a conversation or start a new one to begin chatting.</p>
              <button className="btn btn-primary px-4" onClick={() => setShowSearch(true)}>
                <i className="bi bi-pencil-square me-2"></i>Start a Conversation
              </button>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="tk-chat-main-header">
                <button className="btn btn-sm btn-ghost d-md-none me-2" onClick={() => { setActive(null); activeRef.current = null; }}>
                  <i className="bi bi-arrow-left fs-5"></i>
                </button>
                <div className="tk-contact-avatar">
                  <Avatar src={active.avatarUrl} name={active.fullName || active.username} size={42} />
                  {isOnline(active.username) && <span className="tk-contact-online"></span>}
                </div>
                <div className="ms-2">
                  <div className="fw-bold" style={{ fontSize: '0.95rem' }}>{active.fullName || active.username}</div>
                  <div className="tk-header-status">
                    {isOnline(active.username) ? <><span className="tk-status-dot-sm bg-success"></span>Active now</> : <><span className="tk-status-dot-sm bg-secondary"></span>Offline</>}
                  </div>
                </div>
                <div className="ms-auto d-flex gap-2">
                  <button className="tk-icon-btn-sm"><i className="bi bi-telephone"></i></button>
                  <button className="tk-icon-btn-sm"><i className="bi bi-camera-video"></i></button>
                  <button className="tk-icon-btn-sm"><i className="bi bi-three-dots-vertical"></i></button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="tk-chat-main-body" ref={bodyRef}>
                {messages.length === 0 ? (
                  <div className="text-center my-auto">
                    <Avatar src={active.avatarUrl} name={active.fullName || active.username} size={64} />
                    <p className="fw-semibold mt-3 mb-1">{active.fullName || active.username}</p>
                    <p className="text-muted small">This is the beginning of your conversation. Say hello! 👋</p>
                  </div>
                ) : messages.map((m) => {
                  const isMine = m.senderId === myId;
                  const editing = editingId === m.messageId;
                  return (
                    <div key={m.messageId} className={`tk-msg-row ${isMine ? 'tk-msg-mine' : 'tk-msg-theirs'}`}>
                      {!isMine && <Avatar src={active.avatarUrl} name={active.fullName || active.username} size={30} />}
                      <div className={`tk-msg-content ${isMine ? 'tk-msg-out' : 'tk-msg-in'}`}>
                        {editing ? (
                          <div className="tk-msg-edit-box">
                            <input className="form-control form-control-sm" value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(m.messageId); if (e.key === 'Escape') cancelEdit(); }}
                              autoFocus />
                            <div className="d-flex gap-1 mt-1">
                              <button className="btn btn-xs btn-primary" onClick={() => saveEdit(m.messageId)}>Save</button>
                              <button className="btn btn-xs btn-ghost" onClick={cancelEdit}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="tk-msg-text">
                              {m.content && m.content.match(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)/i)
                                ? <img src={m.content} alt="shared" className="tk-chat-img" />
                                : m.content && m.content.includes('http') && m.content.includes('/uploads/')
                                  ? <>
                                      {m.content.split('\n').map((line, i) =>
                                        line.match(/^https?:\/\/.*\/uploads\//)
                                          ? <img key={i} src={line} alt="shared" className="tk-chat-img" />
                                          : <p key={i} className="mb-1">{line}</p>
                                      )}
                                    </>
                                  : <p className="mb-0">{m.content}</p>
                              }
                            </div>
                            <span className="tk-msg-time">{formatTime(m.timestamp)}</span>
                            {isMine && (
                              <div className="tk-msg-actions-bar">
                                <button onClick={() => startEdit(m)} title="Edit"><i className="bi bi-pencil"></i></button>
                                <button onClick={() => deleteMsg(m.messageId)} title="Delete"><i className="bi bi-trash3"></i></button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input Area */}
              <div className="tk-chat-main-footer">
                <div className="position-relative">
                  <button type="button" className="tk-footer-btn" onClick={() => setShowEmoji(!showEmoji)}>
                    <i className="bi bi-emoji-smile"></i>
                  </button>
                  {showEmoji && (
                    <div className="tk-emoji-picker">
                      {['😀','😂','❤️','👍','🎉','🔥','💯','👋','🙏','✨','💪','🚀','⭐','😊','🤝','💼','✅','🎯','👏','💡'].map((e) => (
                        <button key={e} className="tk-emoji-btn" onClick={() => { setText((prev) => prev + e); setShowEmoji(false); }}>{e}</button>
                      ))}
                    </div>
                  )}
                </div>
                <button type="button" className="tk-footer-btn" onClick={() => fileInputRef.current?.click()}>
                  <i className="bi bi-paperclip"></i>
                </button>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) { setAttachFile(file); setText((prev) => prev || `📎 ${file.name}`); }
                  e.target.value = '';
                }} />
                <form className="flex-grow-1" onSubmit={send}>
                  <input ref={inputRef} className="tk-chat-input-field" placeholder="Type your message..."
                    value={text} onChange={(e) => setText(e.target.value)} />
                </form>
                <button className="tk-send-btn" onClick={send} disabled={!text.trim() && !attachFile}>
                  <i className="bi bi-send-fill"></i>
                </button>
              </div>
              {attachFile && (
                <div className="tk-attach-preview">
                  <img src={URL.createObjectURL(attachFile)} alt="preview" className="tk-attach-thumb" />
                  <span className="small text-muted flex-grow-1 text-truncate">{attachFile.name}</span>
                  <button className="btn btn-sm btn-link text-danger p-0" onClick={() => { setAttachFile(null); setText(''); }}>
                    <i className="bi bi-x-circle"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ---- New Chat Modal ---- */}
      {showSearch && (
        <div className="tk-modal-backdrop" onClick={() => setShowSearch(false)}>
          <div className="tk-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0"><i className="bi bi-pencil-square me-2 text-primary"></i>New Conversation</h6>
              <button className="btn-close" onClick={() => setShowSearch(false)}></button>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text bg-white border-end-0"><i className="bi bi-search text-muted"></i></span>
              <input className="form-control border-start-0" autoFocus placeholder="Search by name or username..."
                value={searchQ} onChange={(e) => runSearch(e.target.value)} />
            </div>
            <div className="tk-modal-results">
              {results.length === 0 ? (
                <div className="text-muted small text-center py-4">
                  {searchQ ? <><i className="bi bi-person-x d-block mb-1" style={{ fontSize: '1.5rem' }}></i>No users found.</> : 'Type to search people.'}
                </div>
              ) : results.map((u) => (
                <div key={u.userId} className="tk-contact-item rounded-3" onClick={() => startChat(u)}>
                  <Avatar src={u.avatarUrl} name={u.fullName || u.username} size={42} />
                  <div className="tk-contact-info">
                    <span className="tk-contact-name">{u.fullName || u.username}</span>
                    <span className="tk-contact-status">@{u.username} · {(u.role || '')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
