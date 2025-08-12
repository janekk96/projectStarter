import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi, type User } from "../lib/api";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!localStorage.getItem("access_token");

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          // Validate the token by fetching current user
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } catch {
          // Token is invalid, clear everything
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const authResponse = await authApi.login({ username: email, password });

      // Store the token
      localStorage.setItem("access_token", authResponse.access_token);

      // Fetch user details
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.register({ email, password });

      // After successful registration, automatically log the user in
      await login(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      // Even if logout fails on the server, we should clear local storage
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      // Redirect to post-logout page
      window.location.href = "/post-logout";
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
