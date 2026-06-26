import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/portfolio';

class PortfolioService {
  getMyPortfolio() {
    return axios.get(API, { headers: authHeader() });
  }

  getUserPortfolio(userId) {
    return axios.get(`${API}/user/${userId}`, { headers: authHeader() });
  }

  getByCategory(category) {
    return axios.get(`${API}/category/${category}`, { headers: authHeader() });
  }

  create(data) {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.projectUrl) formData.append('projectUrl', data.projectUrl);
    if (data.category) formData.append('category', data.category);
    if (data.fileType) formData.append('fileType', data.fileType);
    if (data.file) formData.append('file', data.file);
    return axios.post(API, formData, { headers: authHeader() });
  }

  update(id, data) {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.projectUrl) formData.append('projectUrl', data.projectUrl);
    if (data.category) formData.append('category', data.category);
    if (data.fileType) formData.append('fileType', data.fileType);
    if (data.file) formData.append('file', data.file);
    return axios.put(`${API}/${id}`, formData, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(`${API}/${id}`, { headers: authHeader() });
  }
}

export default new PortfolioService();
