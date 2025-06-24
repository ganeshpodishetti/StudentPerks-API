// Service for fetching stores
import { publicApiClient } from './apiClient';

// Define response types
export interface Store {
  id: string;
  name: string;
  description?: string;
  website?: string;
}

export const storeService = {
  async getStores(): Promise<Store[]> {
    try {
      const response = await publicApiClient.get('/api/stores');
      return response.data;
    } catch (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
  },

  async getStore(id: string): Promise<Store> {
    try {
      const response = await publicApiClient.get(`/api/stores/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching store:', error);
      throw error;
    }
  },

  async createStore(storeData: { name: string; description?: string; website?: string }): Promise<Store> {
    try {
      const response = await publicApiClient.post('/api/stores', storeData);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  async updateStore(id: string, storeData: { name: string; description?: string; website?: string }): Promise<Store> {
    try {
      const response = await publicApiClient.put(`/api/stores/${id}`, storeData);
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  async deleteStore(id: string): Promise<void> {
    try {
      await publicApiClient.delete(`/api/stores/${id}`);
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchStores = storeService.getStores;
