import axios from 'axios';

// -------------------------------------------------------
// Base Axios instance
// All API calls use this instance so the base URL and
// the Authorization header are set in one place.
// -------------------------------------------------------
const API = axios.create({
  baseURL: '/api', // Vite proxy forwards /api → http://localhost:5000/api
});

// Before every request, attach the JWT token from localStorage (if it exists)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
