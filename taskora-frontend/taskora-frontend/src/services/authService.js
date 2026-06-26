import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

class AuthService {
  register({ fullName, username, mobile, email, password, role }) {
    return axios.post(API_URL + 'register', { fullName, username, mobile, email, password, role });
  }

  async login(username, password) {
    const response = await axios.post(API_URL + 'login', { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  }

  verifyEmail(token) {
    return axios.post(API_URL + `verify-email?token=${encodeURIComponent(token)}`);
  }

  forgotPassword(email) {
    return axios.post(API_URL + `forgot-password?email=${encodeURIComponent(email)}`);
  }

  resetPassword(token, newPassword) {
    return axios.post(API_URL + `reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`);
  }
}

export default new AuthService();
