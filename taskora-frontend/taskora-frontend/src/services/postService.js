import axios from 'axios';
import { authHeader } from './auth';

const API = 'http://localhost:8081/api/posts/';

class PostService {
  getFeed(page = 0, size = 20) {
    return axios.get(API + 'feed', { params: { page, size }, headers: authHeader() });
  }

  getUserPosts(userId) {
    return axios.get(API + `user/${userId}`, { headers: authHeader() });
  }

  create(content, image) {
    const formData = new FormData();
    if (content) formData.append('content', content);
    if (image) formData.append('image', image);
    return axios.post(API.slice(0, -1), formData, { headers: authHeader() });
  }

  update(id, content) {
    return axios.put(API + id, { content }, { headers: authHeader() });
  }

  delete(id) {
    return axios.delete(API + id, { headers: authHeader() });
  }

  toggleLike(id) {
    return axios.post(API + `${id}/like`, {}, { headers: authHeader() });
  }

  getComments(id) {
    return axios.get(API + `${id}/comments`, { headers: authHeader() });
  }

  addComment(id, comment) {
    return axios.post(API + `${id}/comments`, { comment }, { headers: authHeader() });
  }
}

export default new PostService();
