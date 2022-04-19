import authHeader from './auth-header';
import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get(`/users/getAll`, { headers: authHeader() });
  }
  getByCriteria(data) {
    return http.get(`/users/search/${data}`, { headers: authHeader() });
  }
  refreshUser(id) {
    return http.get(`/users/refresh/${id}`, { headers: authHeader() });
  }
  update(id, data) {
    return http.put(`/users/update/${id}`, data, { headers: authHeader() });
  }
  clearNotifications(id) {
    return http.put(`/users/clearnotifications/${id}`, { headers: authHeader() });
  }
  setUser(id, data) {
    return http.put(`/users/setuser/${id}`, data, { headers: authHeader() });
  }
  setMod(id, data) {
    return http.put(`/users/setmod/${id}`, data, { headers: authHeader() });
  }
  setAdmin(id, data) {
    return http.put(`/users/setadmin/${id}`, data, { headers: authHeader() });
  }
  delete(id) {
    return http.delete(`/users/delete/${id}`, { headers: authHeader() });
  }
}
export default new UserDataService();