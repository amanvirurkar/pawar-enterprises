import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Connection to your Node.js backend!
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT token for admin routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
