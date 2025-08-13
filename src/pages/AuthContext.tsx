import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient, { AdminUser, LoginData, TokenManager } from './api';
import { useToast } from '../hooks/use-toast';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginData) => Promise<boolean>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user;

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = TokenManager.getAccessToken();

      if (token && !TokenManager.isTokenExpired(token)) {
        try {
          const response = await apiClient.getProfile();
          if (response.status === 'success' && response.data) {
            setUser(response.data);
          } else {
            TokenManager.clearTokens();
          }
        } catch (error) {
          console.error('Failed to load user profile:', error);
          TokenManager.clearTokens();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.login(credentials);

      if (response.status === 'success' && response.data) {
        const { admin, tokens } = response.data;
        TokenManager.setTokens(tokens.accessToken, tokens.refreshToken);
        setUser(admin);

        toast({
          title: 'Login Successful',
          description: `Welcome back, ${admin.first_name || admin.email}!`,
        });

        return true;
      } else {
        toast({
          title: 'Login Failed',
          description: response.message || 'Invalid credentials',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An error occurred during login. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.clearTokens();
      setUser(null);
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.status === 'success' && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
