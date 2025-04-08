import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'Student' | 'Instructor' | 'Admin';
}

export interface AuthResponse {
  user: {
    _id: string;
    fullName: string;
    email: string;
    role: 'admin' | 'instructor' | 'student';
  };
  token: string;
}

// Set token in localStorage
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Add token to request headers
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  const { token, user } = response.data;
  setToken(token);
  return { token, user };
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  const { token, user } = response.data;
  setToken(token);
  return { token, user };
};

// Logout user
export const logout = () => {
  removeToken();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Get current user from token
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded: any = jwtDecode(token);
    return decoded.user;
  } catch (error) {
    return null;
  }
};

// Admin functions
export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const createUser = async (userData: RegisterData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`${API_URL}/users/${userId}`);
  return response.data;
}; 