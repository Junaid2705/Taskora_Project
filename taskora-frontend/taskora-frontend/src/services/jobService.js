import axios from 'axios';

const API_URL = 'http://localhost:8080/api/';

// Helper function to grab the JWT token for protected routes
const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

class JobService {
  // ==========================================
  // JOB BOARD ENDPOINTS
  // ==========================================

  // Public Endpoint: Get dropdown categories
  getCategories() {
    return axios.get(API_URL + 'jobs/categories');
  }

  // Public Endpoint: Get all open jobs
  getJobFeed() {
    return axios.get(API_URL + 'jobs/feed');
  }

  // Protected Endpoint: Post a new job (Requires Token)
  createJob(jobData) {
    return axios.post(API_URL + 'jobs/create', jobData, { headers: authHeader() });
  }

  // ==========================================
  // APPLICATION ENDPOINTS
  // ==========================================

  // Freelancer: Submit an application
  applyForJob(applicationData) {
    return axios.post(API_URL + 'applications/apply', applicationData, { headers: authHeader() });
  }

  // Employer: View who applied to a specific job
  getJobApplications(jobId) {
    return axios.get(API_URL + `applications/job/${jobId}`, { headers: authHeader() });
  }

  // Freelancer: View jobs I have applied to
  getMyApplications() {
    return axios.get(API_URL + 'applications/my-applications', { headers: authHeader() });
  }

  // Employer: Accept a freelancer's application
  acceptApplication(applicationId) {
    return axios.put(API_URL + `applications/${applicationId}/accept`, {}, { headers: authHeader() });
  }
}

export default new JobService();