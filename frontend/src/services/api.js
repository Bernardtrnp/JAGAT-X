/*
================================================================================
JAGAT-X: API SERVICE LAYER
================================================================================
Logika komunikasi antara React dan FastAPI Backend.
================================================================================
*/
import axios from 'axios';

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: (username, password) => 
    api.post("/v1/auth/login", { username, password }),
};

export const diagnosticService = {
  analyzeXRay: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;