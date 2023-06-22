import { AxiosInstance } from "axios";
import { User } from "../types/User";
import client from "../utils/client.axios";
import HttpService from "./http.service";

class UserService extends HttpService {
  constructor(api: AxiosInstance) {
    super(api);
  }

  login(username: string, password: string) {
    return this.post<User>("/users/login", { username, password });
  }

  register(username: string, password: string) {
    return this.post("/users/register", { username, password });
  }

  logout() {
    return this.post("/users/logout", {});
  }

  getUser() {
    return this.get<User>("/users/me");
  }
}

export const userService = new UserService(client);
