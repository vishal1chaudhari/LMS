import axios from 'axios';
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
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

// Store token in localStorage
const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

const getToken = () => {
  return localStorage.getItem('token');
};

const removeToken = () => {
  localStorage.removeItem('token');
};

// Add token to axios headers
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

export const logout = () => {
  removeToken();
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload.userId,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    removeToken();
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