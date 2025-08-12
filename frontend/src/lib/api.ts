import axios from "axios";

// API base URL configuration for different environments
const getApiBaseUrl = (): string => {
  // For production/docker environment, use the environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // For development environment, use localhost
  if (import.meta.env.DEV) {
    return "http://localhost:8000";
  }

  // Fallback for production builds without explicit API URL
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Token is expired or invalid, clear it and redirect to login
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Auth API endpoints
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await api.post<AuthResponse>("/auth/jwt/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response = await api.post<User>("/auth/register", userData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/jwt/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/users/me");
    return response.data;
  },
};
