import axios from 'axios';

const peluqueriaApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

peluqueriaApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { peluqueriaApi };