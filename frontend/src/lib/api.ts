import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data: { name: string; email: string; password: string }) =>
  API.post('/auth/register', data);

export const loginUser = (data: { email: string; password: string }) =>
  API.post('/auth/login', data);

export const analyzeReport = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return API.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getReports = () => API.get('/reports');

export default API;

export const sendChatMessage = (message: string, report_context: string = '') =>
  API.post('/chat', { message, report_context });

export const getRecommendations = (report_data: string) =>
  API.post('/recommendations', { report_data });

export const getTrends = () => API.get('/trends');

export const getAdminStats = () => API.get('/admin/stats');