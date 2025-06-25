// Service for fetching stores
import apiClient, { publicApiClient } from './apiClient';

// Define response types
export interface Store {
  id: string;
  name: string;
  description?: string;
  website?: string;
}

export interface CreateStoreRequest {
  name: string;
  description?: string;
  website?: string;
}

export interface UpdateStoreRequest extends CreateStoreRequest {}

export const storeService = {
  // Public endpoints - no authentication required
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

  // Admin endpoints - authentication required
  async createStore(storeData: CreateStoreRequest): Promise<Store> {
    try {
      console.log('Creating store with data:', storeData);
      
      // Clean up the data to remove undefined values
      const cleanStoreData = Object.fromEntries(
        Object.entries(storeData).filter(([_, value]) => value !== undefined)
      );
      
      console.log('Cleaned store data:', cleanStoreData);
      
      const response = await apiClient.post('/api/stores', cleanStoreData);
      console.log('Store created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating store:', error);
      throw error;
    }
  },

  async updateStore(id: string, storeData: UpdateStoreRequest): Promise<Store> {
    try {
      console.log('Updating store:', id, 'with data:', storeData);
      
      // Clean up the data to remove undefined values
      const cleanStoreData = Object.fromEntries(
        Object.entries(storeData).filter(([_, value]) => value !== undefined)
      );
      
      console.log('Cleaned store data for update:', cleanStoreData);
      
      const response = await apiClient.put(`/api/stores/${id}`, cleanStoreData);
      console.log('Store updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating store:', error);
      throw error;
    }
  },

  async deleteStore(id: string): Promise<void> {
    try {
      console.log('Deleting store:', id);
      await apiClient.delete(`/api/stores/${id}`);
      console.log('Store deleted successfully');
    } catch (error) {
      console.error('Error deleting store:', error);
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchStores = storeService.getStores;
