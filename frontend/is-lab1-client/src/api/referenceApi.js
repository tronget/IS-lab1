import { api } from "./client";

export const disciplineApi = {
  list: () => api.get("/api/disciplines"),
};

export const coordinatesApi = {
  list: () => api.get("/api/coordinates"),
};

export const personApi = {
  list: () => api.get("/api/persons"),
};

export const locationApi = {
  list: () => api.get("/api/locations"),
};
