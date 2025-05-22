
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://0.0.0.0:5000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const requests = {
  // Auth
  login: (data: { username: string; password: string }) => 
    api.post('/api/admin/login', data),

  // Tasks
  getTasks: () => api.get('/api/tasks'),
  createTask: (data: any) => api.post('/api/tasks', data),
  updateTask: (id: number, data: any) => api.put(`/api/tasks/${id}`, data),
  deleteTask: (id: number) => api.delete(`/api/tasks/${id}`),

  // Currencies
  getCurrencies: () => api.get('/api/currencies'),
  createCurrency: (data: any) => api.post('/api/currencies', data),
  updateCurrency: (id: number, data: any) => api.put(`/api/currencies/${id}`, data),
  deleteCurrency: (id: number) => api.delete(`/api/currencies/${id}`),

  // Withdrawal Methods
  getWithdrawalMethods: () => api.get('/api/withdrawal-methods'),
  createWithdrawalMethod: (data: any) => api.post('/api/withdrawal-methods', data),
  updateWithdrawalMethod: (id: number, data: any) => 
    api.put(`/api/withdrawal-methods/${id}`, data),
  deleteWithdrawalMethod: (id: number) => 
    api.delete(`/api/withdrawal-methods/${id}`),
};

export default requests;
