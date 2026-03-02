import axios from 'axios';
import backendURL from './backend'

const api = axios.create({baseURL: backendURL,});

// Intercept 401 responses globally to redirect to login on session expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('serviceToken');
      delete api.defaults.headers.common.Authorization;
      if (window.location.pathname !== '/auth/signin-1') {
        window.location.href = '/auth/signin-1';
      }
    }
    return Promise.reject(error);
  }
);

export default api;