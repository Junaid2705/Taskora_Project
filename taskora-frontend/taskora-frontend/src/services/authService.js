import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {

  // Sends the stacked form data to the Spring Boot registration endpoint
  register(fullName, username, mobile, email, password, role) {
    return axios.post(API_URL + 'register', {
      fullName,
      username,
      mobile,
      email,
      password,
      role
    });
  }

  // Submits credentials, gets the JWT back, and caches it in localStorage
  async login(username, password) {
    const response = await axios.post(API_URL + 'login', { username, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  // Wipes the cache to log the user out
  logout() {
    localStorage.removeItem('user');
  }

  // Helper method to retrieve the currently cached user session data
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // ==========================================
  // NEW METHODS FOR MILESTONE 3
  // ==========================================

  // 1. Send the token to verify the email
  verifyEmail(token) {
    return axios.post(API_URL + `verify-email?token=${token}`);
  }

  // 2. Request a password reset link
  forgotPassword(email) {
    return axios.post(API_URL + `forgot-password?email=${email}`);
  }

  // 3. Submit the new password with the token
  resetPassword(token, newPassword) {
    return axios.post(API_URL + `reset-password?token=${token}&newPassword=${newPassword}`);
  }
}

export default new AuthService();