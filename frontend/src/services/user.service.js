import authHeader from './auth-header';
import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get(`/users/getAll`, { headers: authHeader() });
  }
  getById(id) {
    return http.get(`/users/get/id/${id}`, { headers: authHeader() });
  }
  getByUsername(username) {
    return http.get(`/users/get/username/${username}`, { headers: authHeader() });
  }
  getByEmail(email) {
    return http.get(`/users/get/email/${email}`, { headers: authHeader() });
  }
  update(id, data) {
    return http.put(`/users/update/${id}`, data, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/users/delete/${id}`, { headers: authHeader() });
  }
}
export default new UserDataService();