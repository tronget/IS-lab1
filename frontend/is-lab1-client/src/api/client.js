import axios from "axios";

export const API_BASE = "http://localhost:9090";

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});
