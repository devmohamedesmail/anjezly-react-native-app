import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Types
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'freelancer' | 'client';
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'freelancer' | 'client';
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
  errors?: Record<string, string[]>;
}

interface AuthContextType {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<AuthResponse>;
  
  // Utils
  clearError: () => void;
  error: string | null;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const API_BASE_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

// Auth Provider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    token: null,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  // Check if user is authenticated on app start
  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_KEY);

      if (token && userData) {
        const user = JSON.parse(userData);
        
        // Verify token is still valid
        const isValid = await verifyToken(token);
        
        if (isValid) {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Set default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token is invalid, clear storage
          await clearAuthData();
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Verify token validity
  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  // Clear authentication data
  const clearAuthData = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    delete axios.defaults.headers.common['Authorization'];
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Store authentication data
  const storeAuthData = async (user: User, token: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  // Login function
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        await storeAuthData(user, token);
        
        return {
          success: true,
          data: { user, token },
          message: 'Login successful'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Network error occurred';
      setError(errorMessage);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors
      };
    }
  };

  // Register function
  const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return {
          success: false,
          message: 'Passwords do not match'
        };
      }

      const { confirmPassword, ...registerData } = credentials;
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        await storeAuthData(user, token);
        
        return {
          success: true,
          data: { user, token },
          message: 'Registration successful'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Network error occurred';
      setError(errorMessage);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      
      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Optional: Call logout endpoint to invalidate token on server
      if (authState.token) {
        try {
          await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${authState.token}` }
          });
        } catch (error) {
          // Continue with logout even if server call fails
          console.warn('Server logout failed:', error);
        }
      }
      
      await clearAuthData();
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear even if there's an error
      await clearAuthData();
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!authState.token) return false;

      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${authState.token}` }
      });
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        await storeAuthData(user, token);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      return false;
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>): Promise<AuthResponse> => {
    try {
      setError(null);

      const response = await axios.put(`${API_BASE_URL}/auth/profile`, data, {
        headers: { Authorization: `Bearer ${authState.token}` }
      });
      
      if (response.data.success) {
        const updatedUser = { ...authState.user, ...response.data.data };
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        
        setAuthState(prev => ({
          ...prev,
          user: updatedUser as User
        }));
        
        return {
          success: true,
          data: { user: updatedUser as User, token: authState.token! },
          message: 'Profile updated successfully'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Profile update failed'
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Network error occurred';
      setError(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        errors: error.response?.data?.errors
      };
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    // State
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth guard component
export const AuthGuard: React.FC<{ 
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
}> = ({ children, fallback, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return fallback || null;
  }

  if (requireAuth && !isAuthenticated) {
    return fallback || null;
  }

  if (!requireAuth && isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
};

export default AuthContext;
