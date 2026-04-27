import axios from 'axios';
import { toast } from '../components/ToastContainer';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
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
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'Something went wrong';
    
    if (error.response?.data?.detail) {
      // Handle validation errors from FastAPI
      if (Array.isArray(error.response.data.detail)) {
        const errorDetails = error.response.data.detail;
        message = errorDetails.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
      } else if (typeof error.response.data.detail === 'string') {
        message = error.response.data.detail;
      } else if (typeof error.response.data.detail === 'object') {
        message = JSON.stringify(error.response.data.detail);
      }
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.message) {
      message = error.message;
    }
    
    toast.error(message);
    return Promise.reject(error);
  }
);

export default apiClient;
