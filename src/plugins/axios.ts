import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: 'tu-api-url',
  timeout: 10000,
});

// Interceptor para manejar errores de red
api.interceptors.response.use(
  response => response,
  error => {
    if (!navigator.onLine) {
      router.push({ name: 'Error', params: { code: 'offline' } });
    } else if (error.response && error.response.status === 404) {
      router.push({ name: 'Error', params: { code: '404' } });
    } else if (error.response) {
      router.push({ 
        name: 'Error', 
        params: { 
          code: error.response.status.toString(),
          message: error.response.statusText
        } 
      });
    }
    return Promise.reject(error);
  }
);

export default api;