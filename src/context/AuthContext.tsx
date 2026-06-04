import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    let loggedInUser: User;
    
    if (email === 'admin@college.edu' && password === 'admin') {
      loggedInUser = { id: '0', name: 'System Admin', email, role: 'admin' };
    } else {
      // Check for registered mock users
      const registeredUsersJson = await AsyncStorage.getItem('registeredUsers');
      let registeredUsers: any[] = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
      
      const foundUser = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (foundUser) {
        loggedInUser = { 
          id: foundUser.id, 
          name: foundUser.name, 
          email: foundUser.email, 
          role: 'student', 
          rollNumber: foundUser.rollNumber 
        };
      } else {
        throw new Error('Account not found. Please sign up first.');
      }
    }
    
    await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const register = async (name: string, email: string, password: string, rollNumber: string) => {
    const registeredUsersJson = await AsyncStorage.getItem('registeredUsers');
    let registeredUsers: any[] = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
    
    // Add new user to the mock database
    registeredUsers.push({
      id: Date.now().toString(),
      name,
      email,
      password,
      rollNumber
    });
    
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const resetPassword = async (email: string, newPassword: string) => {
    const registeredUsersJson = await AsyncStorage.getItem('registeredUsers');
    let registeredUsers: any[] = registeredUsersJson ? JSON.parse(registeredUsersJson) : [];
    
    const userIndex = registeredUsers.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (userIndex === -1) {
      throw new Error('Account not found. Please check your email.');
    }
    
    registeredUsers[userIndex].password = newPassword;
    await AsyncStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
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
