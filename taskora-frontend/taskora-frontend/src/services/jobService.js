import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/';

class JobService {
  // ---------- Categories ----------
  getCategories() {
    return axios.get(API + 'categories/active');
  }

  // ---------- Jobs ----------
  getJobFeed() {
    return axios.get(API + 'jobs/feed');
  }

  searchJobs(params) {
    return axios.get(API + 'jobs/search', { params });
  }

  getJob(id) {
    return axios.get(API + `jobs/${id}`, { headers: authHeader() });
  }

  getMyJobs() {
    return axios.get(API + 'jobs/my-jobs', { headers: authHeader() });
  }

  createJob(data) {
    return axios.post(API + 'jobs/create', data, { headers: authHeader() });
  }

  updateJob(id, data) {
    return axios.put(API + `jobs/${id}`, data, { headers: authHeader() });
  }

  deleteJob(id) {
    return axios.delete(API + `jobs/${id}`, { headers: authHeader() });
  }

  // ---------- Applications ----------
  applyForJob(data) {
    return axios.post(API + 'applications/apply', data, { headers: authHeader() });
  }

  getJobApplications(jobId) {
    return axios.get(API + `applications/job/${jobId}`, { headers: authHeader() });
  }

  getMyApplications() {
    return axios.get(API + 'applications/my-applications', { headers: authHeader() });
  }

  checkApplied(jobId) {
    return axios.get(API + `applications/check/${jobId}`, { headers: authHeader() });
  }

  updateApplicationStatus(applicationId, status) {
    return axios.put(API + `applications/${applicationId}/status`, { status }, { headers: authHeader() });
  }
}

export default new JobService();
