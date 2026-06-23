import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profile/';

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

class ProfileService {
  // Get current user's profile
  getProfile() {
    return axios.get(API_URL + 'me', { headers: authHeader() });
  }

  // Update bio and portfolio link
  updateProfile(data) {
    return axios.put(API_URL + 'update', data, { headers: authHeader() });
  }

  // Upload Avatar (Requires multipart/form-data)
  uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(API_URL + 'upload-avatar', formData, {
      headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
    });
  }

  // Upload Cover (Requires multipart/form-data)
  uploadCover(file) {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(API_URL + 'upload-cover', formData, {
      headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' }
    });
  }
}

export default new ProfileService();