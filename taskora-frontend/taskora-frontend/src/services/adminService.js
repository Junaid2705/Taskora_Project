import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/admin/';
const CAT_API = 'http://localhost:8081/api/categories';

class AdminService {
  getStats() {
    return axios.get(API + 'stats', { headers: authHeader() });
  }

  // Users
  getUsers(page = 0, size = 20) {
    return axios.get(API + 'users', { params: { page, size }, headers: authHeader() });
  }

  updateUserStatus(id, status) {
    return axios.put(API + `users/${id}/status`, { status }, { headers: authHeader() });
  }

  deleteUser(id) {
    return axios.delete(API + `users/${id}`, { headers: authHeader() });
  }

  // Jobs
  getJobs(page = 0, size = 20) {
    return axios.get(API + 'jobs', { params: { page, size }, headers: authHeader() });
  }

  deleteJob(id) {
    return axios.delete(API + `jobs/${id}`, { headers: authHeader() });
  }

  approveJob(id) {
    return axios.put(API + `jobs/${id}/approve`, {}, { headers: authHeader() });
  }

  rejectJob(id) {
    return axios.put(API + `jobs/${id}/reject`, {}, { headers: authHeader() });
  }

  // Projects
  getProjects(page = 0, size = 20) {
    return axios.get(API + 'projects', { params: { page, size }, headers: authHeader() });
  }

  deleteProject(id) {
    return axios.delete(API + `projects/${id}`, { headers: authHeader() });
  }

  approveProject(id) {
    return axios.put(API + `projects/${id}/approve`, {}, { headers: authHeader() });
  }

  rejectProject(id) {
    return axios.put(API + `projects/${id}/reject`, {}, { headers: authHeader() });
  }

  // Subscriptions
  getSubscriptions(page = 0, size = 20) {
    return axios.get(API + 'subscriptions', { params: { page, size }, headers: authHeader() });
  }

  updateSubscription(id, data) {
    return axios.put(API + `subscriptions/${id}`, data, { headers: authHeader() });
  }

  deleteSubscription(id) {
    return axios.delete(API + `subscriptions/${id}`, { headers: authHeader() });
  }

  // Applications
  getApplications(page = 0, size = 20) {
    return axios.get(API + 'applications', { params: { page, size }, headers: authHeader() });
  }

  updateApplicationStatus(id, status) {
    return axios.put(API + `applications/${id}/status`, { status }, { headers: authHeader() });
  }

  deleteApplication(id) {
    return axios.delete(API + `applications/${id}`, { headers: authHeader() });
  }

  // Categories (uses the existing CategoryController)
  getCategories() {
    return axios.get(CAT_API, { headers: authHeader() });
  }

  createCategory(data) {
    return axios.post(CAT_API, data, { headers: authHeader() });
  }

  updateCategory(id, data) {
    return axios.put(`${CAT_API}/${id}`, data, { headers: authHeader() });
  }

  deleteCategory(id) {
    return axios.delete(`${CAT_API}/${id}`, { headers: authHeader() });
  }

  // Posts
  getPosts(page = 0, size = 20) {
    return axios.get(API + 'posts', { params: { page, size }, headers: authHeader() });
  }

  deletePost(id) {
    return axios.delete(API + `posts/${id}`, { headers: authHeader() });
  }

  // Verification
  getVerificationsPending() {
    return axios.get('http://localhost:8081/api/verification/pending', { headers: authHeader() });
  }

  getVerificationsAll() {
    return axios.get('http://localhost:8081/api/verification/all', { headers: authHeader() });
  }

  approveVerification(id, remarks) {
    return axios.put(`http://localhost:8081/api/verification/${id}/approve`, { remarks }, { headers: authHeader() });
  }

  rejectVerification(id, remarks) {
    return axios.put(`http://localhost:8081/api/verification/${id}/reject`, { remarks }, { headers: authHeader() });
  }
}

export default new AdminService();
