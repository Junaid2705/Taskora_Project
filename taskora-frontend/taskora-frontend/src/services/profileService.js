import axios from 'axios';
import { authHeader } from './auth';

const API_URL = 'http://localhost:8081/api/profile/';

class ProfileService {
  getProfile() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }

  // Full profile fields: fullName, headline, bio, skills, experience,
  // education, country, state, city, website, linkedin, github
  updateProfile(data) {
    return axios.put(API_URL + 'update', data, { headers: authHeader() });
  }

  changePassword(currentPassword, newPassword) {
    return axios.put(API_URL + 'change-password', { currentPassword, newPassword }, { headers: authHeader() });
  }

  deleteAccount() {
    return axios.delete(API_URL + 'delete-account', { headers: authHeader() });
  }

  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    // Let axios set the multipart Content-Type WITH its boundary.
    return axios.post(API_URL + 'upload-avatar', formData, { headers: authHeader() });
  }

  uploadCover(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(API_URL + 'upload-cover', formData, { headers: authHeader() });
  }

  getPortfolio() {
    return axios.get(API_URL + 'portfolio', { headers: authHeader() });
  }

  addPortfolioItem(title, description, projectUrl, file) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('projectUrl', projectUrl);
    formData.append('file', file);
    return axios.post(API_URL + 'portfolio', formData, { headers: authHeader() });
  }

  changeUsername(username) {
    return axios.put(API_URL + 'change-username', { username }, { headers: authHeader() });
  }

  deletePortfolioItem(id) {
    return axios.delete(API_URL + `portfolio/${id}`, { headers: authHeader() });
  }
}

export default new ProfileService();
