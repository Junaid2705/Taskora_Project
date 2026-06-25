import React, { useState, useEffect, useRef } from 'react';
import MessageService from '../services/messageService';
import AuthService from '../services/authService';

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const currentUser = AuthService.getCurrentUser();
  const messagesEndRef = useRef(null);

  // 1. Load contacts on initial render
  useEffect(() => {
    MessageService.getContacts().then(
      (response) => {
        setContacts(response.data);
        setIsLoading(false);
      },
      (error) => {
        console.error("Failed to load contacts", error);
        setIsLoading(false);
      }
    );
  }, []);

  // 2. Load conversation when a contact is clicked
  useEffect(() => {
    if (activeContact) {
      loadConversation();
      // Optional: Set up an interval to poll for new messages every 5 seconds
      const interval = setInterval(loadConversation, 5000);
      return () => clearInterval(interval);
    }
  }, [activeContact]);

  // 3. Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversation = () => {
    MessageService.getConversation(activeContact.userId).then((res) => {
      setMessages(res.data);
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    MessageService.sendMessage(activeContact.userId, newMessage).then(() => {
      setNewMessage(""); // Clear input
      loadConversation(); // Instantly reload chat
    });
  };

  if (isLoading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4 fade-in">
      <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '15px', height: '75vh' }}>
        <div className="row g-0 h-100">
          
          {/* --- LEFT PANE: CONTACTS LIST --- */}
          <div className="col-md-4 col-lg-3 border-end bg-white h-100 d-flex flex-column">
            <div className="p-3 border-bottom bg-light">
              <h5 className="fw-bold mb-0 text-dark">Inbox</h5>
            </div>
            <div className="overflow-auto flex-grow-1">
              {contacts.length === 0 ? (
                <div className="p-4 text-center text-muted small">
                  No active conversations yet. Apply to or post a job to start chatting!
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {contacts.map((contact) => (
                    <li 
                      key={contact.userId}
                      className={`list-group-item list-group-item-action p-3 ${activeContact?.userId === contact.userId ? 'bg-primary bg-opacity-10 border-start border-primary border-4' : ''}`}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={() => setActiveContact(contact)}
                    >
                      <div className="d-flex align-items-center">
                        <img 
                          src={contact.avatarUrl || "https://via.placeholder.com/40"} 
                          alt="Avatar" 
                          className="rounded-circle me-3"
                          style={{ width: '45px', height: '45px', objectFit: 'cover' }}
                        />
                        <div>
                          <h6 className="fw-bold mb-0 text-dark">{contact.fullName}</h6>
                          <small className="text-muted">{contact.role.replace('ROLE_', '')}</small>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* --- RIGHT PANE: CHAT WINDOW --- */}
          <div className="col-md-8 col-lg-9 h-100 d-flex flex-column bg-light">
            {!activeContact ? (
              // Empty State
              <div className="d-flex flex-column justify-content-center align-items-center h-100 text-muted">
                <i className="bi bi-chat-dots fs-1 mb-3 text-secondary opacity-50"></i>
                <h5>Select a conversation to start messaging</h5>
              </div>
            ) : (
              // Active Chat State
              <>
                {/* Chat Header */}
                <div className="p-3 bg-white border-bottom d-flex align-items-center shadow-sm" style={{ zIndex: 10 }}>
                  <img 
                    src={activeContact.avatarUrl || "https://via.placeholder.com/40"} 
                    alt="Avatar" 
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                  <h5 className="fw-bold mb-0 text-dark">{activeContact.fullName}</h5>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted my-auto">
                      Say hello to {activeContact.fullName}!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.messageId} className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div 
                            className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white rounded-bottom-0' : 'bg-white border text-dark'}`}
                            style={{ maxWidth: '75%' }}
                          >
                            <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                            <div className={`small mt-1 text-end ${isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {/* Invisible div to force auto-scroll to bottom */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Form */}
                <div className="p-3 bg-white border-top">
                  <form onSubmit={handleSendMessage} className="d-flex gap-2">
                    <input 
                      type="text" 
                      className="form-control rounded-pill bg-light border-0 px-4" 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      required
                    />
                    <button type="submit" className="btn btn-primary rounded-circle shadow-sm" style={{ width: '45px', height: '45px' }}>
                      <i className="bi bi-send-fill"></i>
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;