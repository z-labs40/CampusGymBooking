import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchApi } from '../utils/api';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  avatarUri?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, rollNumber: string) => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const res = await fetchApi('/users/me');
          setUser(res.data);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        await AsyncStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    await AsyncStorage.setItem('token', res.data.token);
    setUser(res.data);
  };

  const register = async (name: string, email: string, password: string, rollNumber: string) => {
    await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'student', rollNumber })
    });
    // We intentionally don't set the token or user here, so they can be redirected to the login page.
  };

  const resetPassword = async (email: string, newPassword: string) => {
    // Backend doesn't have an endpoint for this yet, throwing an error
    throw new Error('Forgot password is not currently supported by the server.');
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const res = await fetchApi('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    setUser(res.data);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, resetPassword, updateProfile, logout }}>
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
