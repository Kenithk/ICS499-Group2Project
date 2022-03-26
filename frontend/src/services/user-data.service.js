import authHeader from './auth-header';
import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get("/users", { headers: authHeader() });
  }
  get(id) {
    return http.get(`/users/${id}`, { headers: authHeader() });
  }
  findByUserName(name) {
    return http.get(`/users?title=${name}`, { headers: authHeader() });
  }
}
export default new UserDataService();