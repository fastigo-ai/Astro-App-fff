import axios from 'axios';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

// For physical device testing on the same Wi-Fi network, use your computer's local IP address
const baseURL = 'http://192.168.1.8:8000';

export const api = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // Ignore storage errors
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized errors automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 Unauthorized and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't intercept refresh token calls (prevents infinite loops)
      if (originalRequest.url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('@refresh_token');
        if (!refreshToken) throw new Error('No refresh token found');

        // Request a new access token
        const res = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
        const newAccessToken = res.data.data.accessToken;

        // Save new token and set it for this retry request
        await AsyncStorage.setItem('@jwt_token', newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is expired or invalid -> log the user out entirely
        await useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
