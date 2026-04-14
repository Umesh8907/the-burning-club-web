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

// Inject Role-based token from Cookies
axiosInstance.interceptors.request.use((config) => {
  // Determine if this is an admin request
  // Most admin API calls go to /admin/*
  const isAdminRequest = config.url?.startsWith('/admin');
  
  // Choose the appropriate token name
  const tokenName = isAdminRequest ? 'adminAccessToken' : 'accessToken';
  const token = Cookies.get(tokenName);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[AXIOS DEBUG] Using ${tokenName} for ${config.method?.toUpperCase()} ${config.url}`);
  } else {
    // Fallback: If it's a shared endpoint (like /auth/refresh) and we don't have a specific token,
    // we might need to rely on the caller to handle it, but for most requests we just log.
    console.log(`[AXIOS DEBUG] No ${tokenName} found for ${config.url}`);
  }
  return config;
});

// Clean token refresh logic
const refreshAuthLogic = (failedRequest: any) => {
  // Here we need to know WHICH token failed. 
  // We can infer this from the original request URL.
  const isAdminRequest = failedRequest.config.url?.startsWith('/admin');
  const refreshVar = isAdminRequest ? 'adminRefreshToken' : 'refreshToken';
  const accessVar = isAdminRequest ? 'adminAccessToken' : 'accessToken';
  
  const refreshToken = localStorage.getItem(refreshVar);
  
  if (!refreshToken) {
    return Promise.reject(failedRequest);
  }

  return axios
    .post(`${API_URL}/auth/refresh-token`, { refreshToken })
    .then((res) => {
      const { accessToken } = res.data.data;
      Cookies.set(accessVar, accessToken, { expires: 1, path: '/' });
      
      // Update the original request's headers for the retry
      if (failedRequest.config) {
        failedRequest.config.headers['Authorization'] = 'Bearer ' + accessToken;
      }
      
      return Promise.resolve();
    })
    .catch((err) => {
      console.log(`[AXIOS DEBUG] Refresh failed for ${refreshVar}. Clearing session.`);
      Cookies.remove(accessVar, { path: '/' });
      localStorage.removeItem(refreshVar);
      return Promise.reject(err);
    });
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  statusCodes: [401],
});

export default axiosInstance;
