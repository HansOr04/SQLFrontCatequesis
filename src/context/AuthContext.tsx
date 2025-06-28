'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, LoginCredentials, LoginResponse } from '@/types/auth';
import { STORAGE_KEYS } from '@/lib/constants';
import { apiService } from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Solo ejecutar en el cliente
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verificar si el token sigue siendo válido
          try {
            await apiService.get('/auth/profile');
          } catch (error) {
            // Token inválido, limpiar datos
            console.warn('Token inválido, limpiando sesión');
            logout();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid data
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);
      
      if (response.success) {
        const { user: userData, token: authToken } = response.data;
        
        setUser(userData);
        setToken(authToken);
        
        // Guardar en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
          localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
      } else {
        throw new Error(response.message || 'Error de autenticación');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };