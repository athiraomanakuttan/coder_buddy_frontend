import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from "react-toastify";

import useAuthStore from '@/store/authStore'; 
import { jwtDecode } from 'jwt-decode';
import { authUserType } from '@/types/types';

const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:3000';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URI,
  withCredentials: true, // Important for cookies
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Type for token response
interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
  message: string;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decodedToken: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp <= currentTime;
  }catch (error) {
    console.error('Error decoding token:', error); 
    return true;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post<RefreshResponse>(
      `${API_URI}/api/refresh-token`,
      {},
      { withCredentials: true } // Important to include the refresh token cookie
    );

    if (response.data.success) {
      const newAccessToken = response.data.data.accessToken;
      
      // Update the token in localStorage and Zustand store
      if (typeof window !== 'undefined') {
        localStorage.setItem('userAccessToken', newAccessToken);
      }
      
      // Get the current user from the store
      const user = useAuthStore.getState().user;
      
      // Update the store with the new token
      useAuthStore.getState().setUserAuth(user as authUserType, newAccessToken);
      
      // Set the new access token in a cookie as well (similar to your login function)
      document.cookie = `accessToken=${newAccessToken}; path=/; max-age=${60 * 60}; SameSite=Lax`;
      
      return newAccessToken;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('userAccessToken');
    if (token) {
      // Check if token is expired
      if (isTokenExpired(token)) {
        // Try to refresh the token
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          token = newToken;
        } else {
          // If refresh fails, log the user out
          useAuthStore.getState().logout();
          
          // Optional: Redirect to login page if refresh token is invalid
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }
      
      // Add token to headers
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Only try to refresh the token once for a given request
    if (originalRequest && !originalRequest._retry && error.response?.status === 401) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Create a new axios instance for the retry to avoid interceptor loops
          return axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`
            }
          });
        } else {
          // If refresh fails, log the user out
          useAuthStore.getState().logout();
          
          toast.error('Your session has expired. Please login again.');
          
          // Redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        
        // Log out the user
        useAuthStore.getState().logout();
        
        toast.error('Authentication failed. Please login again.');
        
        // Redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    // Handle other errors
    // const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    const errorMessage =  error.message || 'An error occurred';
    
    // Only show toast for non-auth errors, to avoid duplicate messages
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;