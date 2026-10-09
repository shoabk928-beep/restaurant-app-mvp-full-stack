import AsyncStorage from '@react-native-async-storage/async-storage';

// Apne laptop ka IP Address yahan update karein (e.g., http://192.168.X.X:5000/api)
export const BASE_URL = 'http://192.168.0.138:5000/api';

export const apiClient = async (endpoint, method = 'GET', body = null) => {
  try {
    const token = await AsyncStorage.getItem('userToken');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const config = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};