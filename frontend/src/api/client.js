import axios from "axios";

export const API_BASE = "http://localhost:9091";

const TOKEN_KEY = "labwork_token";
let inMemoryToken = null;

const safeStorage = (
  typeof window !== "undefined" && window.localStorage ? window.localStorage : null
);

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export function getStoredToken() {
  if (inMemoryToken) return inMemoryToken;
  if (!safeStorage) return null;
  inMemoryToken = safeStorage.getItem(TOKEN_KEY);
  return inMemoryToken;
}

export function setStoredToken(token) {
  inMemoryToken = token || null;
  if (!safeStorage) return;
  if (token) {
    safeStorage.setItem(TOKEN_KEY, token);
  } else {
    safeStorage.removeItem(TOKEN_KEY);
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }
  return config;
});
