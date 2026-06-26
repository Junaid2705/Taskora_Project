import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/';

class ProjectService {
  // ---------- Projects ----------
  getFeed() {
    return axios.get(API + 'projects/feed');
  }

  search(params) {
    return axios.get(API + 'projects/search', { params });
  }

  getProject(id) {
    return axios.get(API + `projects/${id}`, { headers: authHeader() });
  }

  getMyProjects() {
    return axios.get(API + 'projects/my-projects', { headers: authHeader() });
  }

  createProject(data) {
    return axios.post(API + 'projects', data, { headers: authHeader() });
  }

  updateProject(id, data) {
    return axios.put(API + `projects/${id}`, data, { headers: authHeader() });
  }

  deleteProject(id) {
    return axios.delete(API + `projects/${id}`, { headers: authHeader() });
  }
}

export default new ProjectService();
