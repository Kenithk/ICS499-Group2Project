import authHeader from './auth-header';
import http from "../http-common";

class OrderDataService {
  getAll() {
    return http.get(`/orders/getAll`, { headers: authHeader() });
  }
  getByCriteria(data) {
    return http.get(`/orders/search/${data}`, { headers: authHeader() });
  }
  create(data) {
    return http.post(`/orders/create`, data, { headers: authHeader() });
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
}
export default new OrderDataService();