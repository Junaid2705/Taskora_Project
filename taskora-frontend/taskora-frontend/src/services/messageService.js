import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/';

class MessageService {
  getContacts() {
    return axios.get(API + 'messages/contacts', { headers: authHeader() });
  }

  getConversation(userId) {
    return axios.get(API + `messages/conversation/${userId}`, { headers: authHeader() });
  }

  // Persists + pushes over WebSocket; resolves with the saved message DTO.
  sendMessage(receiverId, content) {
    return axios.post(API + `messages/send/${receiverId}`, { content }, { headers: authHeader() });
  }

  markRead(otherUserId) {
    return axios.put(API + `messages/read/${otherUserId}`, {}, { headers: authHeader() });
  }

  editMessage(messageId, content) {
    return axios.put(API + `messages/${messageId}`, { content }, { headers: authHeader() });
  }

  deleteMessage(messageId) {
    return axios.delete(API + `messages/${messageId}`, { headers: authHeader() });
  }

  getUnreadCount() {
    return axios.get(API + 'messages/unread-count', { headers: authHeader() });
  }

  // Find people to start a new conversation with.
  searchUsers(q) {
    return axios.get(API + 'users/search', { params: { q }, headers: authHeader() });
  }
}

export default new MessageService();
