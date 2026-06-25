import axios from 'axios';

const API_URL = 'http://localhost:8080/api/messages/';

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

class MessageService {
  // Get list of users we have chatted with
  getContacts() {
    return axios.get(API_URL + 'contacts', { headers: authHeader() });
  }

  // Get the chat history with a specific user
  getConversation(userId) {
    return axios.get(API_URL + `conversation/${userId}`, { headers: authHeader() });
  }

  // Send a message to a specific user
  sendMessage(receiverId, content) {
    return axios.post(API_URL + `send/${receiverId}`, { content }, { headers: authHeader() });
  }
}

export default new MessageService();