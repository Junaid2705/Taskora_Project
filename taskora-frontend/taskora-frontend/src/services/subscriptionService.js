import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/subscriptions/';

class SubscriptionService {
  subscribe(creatorId, monthlyPrice) {
    return axios.post(API + `subscribe/${creatorId}`, { monthlyPrice }, { headers: authHeader() });
  }

  unsubscribe(creatorId) {
    return axios.post(API + `unsubscribe/${creatorId}`, {}, { headers: authHeader() });
  }

  getMySubscriptions() {
    return axios.get(API + 'my-subscriptions', { headers: authHeader() });
  }

  getMySubscribers() {
    return axios.get(API + 'my-subscribers', { headers: authHeader() });
  }

  getSubscriberCount(creatorId) {
    return axios.get(API + `count/${creatorId}`, { headers: authHeader() });
  }

  // Creator plan management
  getMyPlan() {
    return axios.get(API + 'plans', { headers: authHeader() });
  }

  createPlan(subscriptionFee) {
    return axios.post(API + 'plans', { subscriptionFee }, { headers: authHeader() });
  }

  updatePlan(subscriptionFee) {
    return axios.put(API + 'plans', { subscriptionFee }, { headers: authHeader() });
  }

  deletePlan() {
    return axios.delete(API + 'plans', { headers: authHeader() });
  }

  // Get all creators with their fees (public)
  getAllCreators() {
    return axios.get(API + 'creators');
  }
}

export default new SubscriptionService();
