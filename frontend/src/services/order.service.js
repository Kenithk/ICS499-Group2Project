import authHeader from './auth-header';
import http from "../http-common";

class OrderDataService {
  getAll() {
    return http.get(`/orders/getAll`, { headers: authHeader() });
  }
  getById(id) {
    return http.get(`/orders/get/id/${id}`, { headers: authHeader() });
  }
  getByUserId(id) {
    return http.get(`/orders/get/userid/${id}`, { headers: authHeader() });
  }
  getByTitle(title) {
    return http.get(`/orders/get/title/${title}`, { headers: authHeader() });
  }
  getByCompleted() {
    return http.get(`/orders/get/completed/`, { headers: authHeader() });
  }
  create(data) {
    return http.post(`/orders/create`, data, { headers: authHeader() });
  }
  updateNotifications(id) {
    return http.post(`/orders/updatenotif/userid/${id}`, { headers: authHeader() });
  }
  update(id, data) {
    return http.put(`/orders/update/${id}`, data, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/orders/delete/${id}`, { headers: authHeader() });
  }
  deleteAll() {
    return http.delete(`/orders/deleteAll`, { headers: authHeader() });
  }
  getUserId() {
    
  }
 
}
export default new OrderDataService();