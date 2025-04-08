import axios from "axios";

// Define API base URL based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You could add authentication tokens here if needed
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized errors (e.g., token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Here you could implement token refresh logic if needed
      // For example:
      // try {
      //   const refreshToken = localStorage.getItem('refresh_token');
      //   const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { token: refreshToken });
      //   const { token } = response.data;
      //   localStorage.setItem('auth_token', token);
      //   originalRequest.headers.Authorization = `Bearer ${token}`;
      //   return api(originalRequest);
      // } catch (err) {
      //   // Logout user if refresh fails
      //   localStorage.removeItem('auth_token');
      //   localStorage.removeItem('refresh_token');
      //   window.location.href = '/login';
      //   return Promise.reject(err);
      // }
    }

    return Promise.reject(error);
  }
);

export default api;
