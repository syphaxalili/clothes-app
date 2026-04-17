import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const clothingAPI = {
  getAll: () => api.get('/clothing'),
  create: (data) => api.post('/clothing', data),
  delete: (id) => api.delete(`/clothing/${id}`)
};

export const outfitAPI = {
  getSuggestion: (latitude, longitude) => 
    api.post('/outfit/suggest', { latitude, longitude })
};

export default api;
