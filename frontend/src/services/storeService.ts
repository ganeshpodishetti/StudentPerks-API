// Service for fetching stores
import axios from 'axios';

// Define response types
export interface Store {
  id: string;
  name: string;
  description?: string;
  website?: string;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5254';

// Create axios instance
const storeApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const storeService = {
  async getStores(): Promise<Store[]> {
    try {
      const response = await storeApi.get('/api/stores');
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  },

  async getStore(id: string): Promise<Store> {
    try {
      const response = await storeApi.get(`/api/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  },

  async createStore(storeData: { name: string; description?: string; website?: string }): Promise<Store> {
    try {
      const response = await storeApi.post('/api/stores', storeData);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  async updateStore(id: string, storeData: { name: string; description?: string; website?: string }): Promise<Store> {
    try {
      const response = await storeApi.put(`/api/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  async deleteStore(id: string): Promise<void> {
    try {
      await storeApi.delete(`/api/stores/${id}`);
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchStores = storeService.getStores;
