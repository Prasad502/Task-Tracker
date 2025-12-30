import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://task-tracker-ffzs.onrender.com';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
