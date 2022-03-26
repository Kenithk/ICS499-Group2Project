import authHeader from './auth-header';
import http from "../http-common";

class OrderDataService {
  getAll() {
    return http.get("/orders", { headers: authHeader() });
  }
  get(id) {
    return http.get(`/orders/${id}`, { headers: authHeader() });
  }
  create(data) {
    return http.post("/orders", data, { headers: authHeader() });
  }
  update(id, data) {
    return http.put(`/orders/${id}`, data, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/orders/${id}`, { headers: authHeader() });
  }
  deleteAll() {
    return http.delete(`/orders`, { headers: authHeader() });
  }
  findByTitle(title) {
    return http.get(`/orders?title=${title}`, { headers: authHeader() });
  }
}
export default new OrderDataService();