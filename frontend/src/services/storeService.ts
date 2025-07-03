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
      
      // Handle 204 No Content response (empty database)
      if (response.status === 204 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching stores:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  async getStore(id: string): Promise<Store> {
    try {
      const response = await publicApiClient.get(`/api/stores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async createStore(storeData: CreateStoreRequest): Promise<Store> {
    try {
      // Clean up the data to remove undefined values
      const cleanStoreData = Object.fromEntries(
        Object.entries(storeData).filter(([_, value]) => value !== undefined)
      );
      
      const response = await apiClient.post('/api/stores', cleanStoreData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateStore(id: string, storeData: UpdateStoreRequest): Promise<Store> {
    try {
      // Clean up the data to remove undefined values
      const cleanStoreData = Object.fromEntries(
        Object.entries(storeData).filter(([_, value]) => value !== undefined)
      );
      
      const response = await apiClient.put(`/api/stores/${id}`, cleanStoreData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteStore(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/stores/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchStores = storeService.getStores;
