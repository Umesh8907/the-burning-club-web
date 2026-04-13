import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject Bearer token from Cookies
axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[AXIOS DEBUG] Sending token in ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    console.log(`[AXIOS DEBUG] No token found for ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Clean token refresh logic
const refreshAuthLogic = (failedRequest: any) => {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    return Promise.reject(failedRequest);
  }

  return axios
    .post(`${API_URL}/auth/refresh-token`, { refreshToken })
    .then((res) => {
      const { accessToken } = res.data.data;
      Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
      
      // Update the original request's headers for the retry
      if (failedRequest.config) {
        failedRequest.config.headers['Authorization'] = 'Bearer ' + accessToken;
      }
      
      return Promise.resolve();
    })
    .catch((err) => {
      console.log('[AXIOS DEBUG] Refresh failed. Clearing all auth indicators.');
      // If refresh fails, clear everything to trigger logout check on next action
      Cookies.remove('accessToken', { path: '/' });
      Cookies.remove('auth_active', { path: '/' });
      Cookies.remove('userRole', { path: '/' });
      localStorage.removeItem('refreshToken');
      return Promise.reject(err);
    });
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  statusCodes: [401],
});

export default axiosInstance;
