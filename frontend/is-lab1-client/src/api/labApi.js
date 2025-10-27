import { api } from "./client";

export const labApi = {
  list: (page = 0, size = 5) =>
    api.get("/api/labworks", { params: { page, size } }),
  get: (id) => api.get(`/api/labworks/${id}`),
  create: (payload) => api.post("/api/labworks", payload),
  update: (id, payload) => api.put(`/api/labworks/${id}`, payload),
  remove: (id) => api.delete(`/api/labworks/${id}`),

  sumMaxPoints: () => api.get("/api/labworks/sum-maximum-point"),
  groupByDescription: () => api.get("/api/labworks/group-by-description"),
  countByTunedInWorks: (value) =>
    api.get("/api/labworks/count-by-tunedInWorks", {
      params: { tunedInWorks: value },
    }),
  addToDiscipline: (labId, disciplineId) =>
    api.put(`/api/labworks/${labId}/add-to-discipline/${disciplineId}`),
  removeFromDiscipline: (labId, disciplineId) =>
    api.delete(`/api/labworks/${labId}/remove-from-discipline/${disciplineId}`),
};
