import axios from "axios";

// Create a unified Axios instance
const api = axios.create({
  // Use VITE_API_URL from environment variables, defaulting to '/api' for reverse proxy
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// We can add interceptors here if needed in the future

export default api;