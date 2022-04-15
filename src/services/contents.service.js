import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/content/';

class ContentsService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getPersonalOrders() {
    return axios.get(API_URL + 'personalorders', { headers: authHeader() });
  }

  getManageUsers() {
    return axios.get(API_URL + 'manageusers', { headers: authHeader() });
  }

  getManageOrders() {
    return axios.get(API_URL + 'manageorders', { headers: authHeader() });
  }

  getCreateOrder() {
    return axios.get(API_URL + 'createorder', { headers: authHeader() });
  }
}

export default new ContentsService();
