import { api } from "./client.js";

export const importApi = {
  history: (page = 0, size = 10) =>
    api.get("/api/imports", { params: { page, size } }),
  getOne: (id) => api.get(`/api/imports/${id}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/imports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
