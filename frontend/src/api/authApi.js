import { api } from "./client.js";

export const authApi = {
  login: (payload) => api.post("/api/auth/login", payload),
  register: (payload) => api.post("/api/auth/register", payload),
  profile: () => api.get("/api/auth/me"),
};
