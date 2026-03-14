import axios from "axios";

// Use environment variable for backend URL, fallback to localhost for development
const BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === "development" ? "http://localhost:3000" : "https://imagino-iba4.onrender.com");

const api = axios.create({
  baseURL: BASE_URL,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;