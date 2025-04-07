import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { toast } from "react-toastify";
import useAuthStore from '@/store/authStore'; 
import { jwtDecode } from 'jwt-decode';
import { authUserType } from '@/types/types';

const API_URI = process.env.NEXT_PUBLIC_API_URI || 'http://localhost:5000';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URI,
  withCredentials: true,  
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

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
      { withCredentials: true }  
    );

    if (response.data.success) {
      const newAccessToken = response.data.data.accessToken;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('userAccessToken', newAccessToken);
      }
      
      const user = useAuthStore.getState().user;
      
      useAuthStore.getState().setUserAuth(user as authUserType, newAccessToken);
      
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
      if (isTokenExpired(token)) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          token = newToken;
        } else {
          useAuthStore.getState().logout();
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (originalRequest && !originalRequest._retry && error.response?.status === 401) {
      originalRequest._retry = true;
      
      try {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          return axios({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${newToken}`
            }
          });
        } else {
          useAuthStore.getState().logout();
          
          toast.error('Your session has expired. Please login again.');
          
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
        
        useAuthStore.getState().logout();
        
        toast.error('Authentication failed. Please login again.');
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    const errorMessage =  error.message || 'An error occurred';
    
    if (error.response?.status !== 401) {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;