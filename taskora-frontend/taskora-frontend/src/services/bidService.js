import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/';

class BidService {
  submitBid(data) {
    return axios.post(API + 'bids', data, { headers: authHeader() });
  }

  updateBid(id, data) {
    return axios.put(API + `bids/${id}`, data, { headers: authHeader() });
  }

  withdrawBid(id) {
    return axios.delete(API + `bids/${id}`, { headers: authHeader() });
  }

  getBidsForProject(projectId) {
    return axios.get(API + `bids/project/${projectId}`, { headers: authHeader() });
  }

  getMyBids() {
    return axios.get(API + 'bids/my-bids', { headers: authHeader() });
  }

  checkBid(projectId) {
    return axios.get(API + `bids/check/${projectId}`, { headers: authHeader() });
  }

  acceptBid(id) {
    return axios.put(API + `bids/${id}/accept`, {}, { headers: authHeader() });
  }

  rejectBid(id) {
    return axios.put(API + `bids/${id}/reject`, {}, { headers: authHeader() });
  }
}

export default new BidService();
