import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use localhost for iOS Simulator, 10.0.2.2 for Android Emulator.
// If testing on a physical device, change this to your computer's local IP (e.g., http://192.168.1.5:8080/api)
export const API_URL = Platform.OS === 'ios' ? 'http://localhost:8080/api' : 'http://10.0.2.2:8080/api';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = await AsyncStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'API request failed');
  }

  return data;
};
