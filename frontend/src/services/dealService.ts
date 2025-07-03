/// <reference types="vite/client" />
import { CreateDealRequest, Deal, UpdateDealRequest } from '../types/Deal';
import apiClient, { publicApiClient } from './apiClient';

export const dealService = {
  // Public endpoints - no authentication required
  async getDeals(): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get('/api/deals');
      console.log('Deal API Response (getDeals):', {
        status: response.status,
        dataLength: response.data?.length || 0,
      });
      
      // Handle 204 No Content response (empty database)
      if (response.status === 204 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching deals:', error);
      throw error;
    }
  },

  async getDeal(id: string): Promise<Deal> {
    try {
      const response = await publicApiClient.get(`/api/deals/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching deal:', error);
      throw error;
    }
  },

  async getDealsByCategory(categoryName: string): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get(`/api/deals/category?name=${encodeURIComponent(categoryName)}`);
      
      // Handle 404 or empty responses
      if (response.status === 404 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      // If it's a 404 error, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching deals by category:', error);
      throw error;
    }
  },

  async getDealsByStore(storeName: string): Promise<Deal[]> {
    try {
      const response = await publicApiClient.get(`/api/deals/store?name=${encodeURIComponent(storeName)}`);
      
      // Handle 404 or empty responses
      if (response.status === 404 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      // If it's a 404 error, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching deals by store:', error);
      throw error;
    }
  },

  async getDealsByUniversity(universityName: string): Promise<Deal[]> {
    try {
      console.log('Fetching deals for university:', universityName);
      const response = await publicApiClient.get(`/api/deals/university?name=${encodeURIComponent(universityName)}`);
      console.log('University deals response:', response.data);
      
      // Handle 404 or empty responses
      if (response.status === 404 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      // If it's a 404 error, return empty array instead of throwing
      if (error.response?.status === 404) {
        return [];
      }
      console.error('Error fetching deals by university:', error);
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async createDeal(dealData: CreateDealRequest): Promise<Deal> {
    try {
      console.log('Creating deal with data:', dealData);
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('title', dealData.title);
      formData.append('description', dealData.description);
      formData.append('discount', dealData.discount);
      formData.append('isActive', dealData.isActive.toString());
      formData.append('redeemType', dealData.redeemType);
      formData.append('categoryName', dealData.categoryName);
      formData.append('storeName', dealData.storeName);
      
      // Add optional fields if they exist
      if (dealData.image) {
        formData.append('image', dealData.image);
      }
      if (dealData.promo) {
        formData.append('promo', dealData.promo);
      }
      if (dealData.url) {
        formData.append('url', dealData.url);
      }
      if (dealData.startDate) {
        formData.append('startDate', dealData.startDate);
      }
      if (dealData.endDate) {
        formData.append('endDate', dealData.endDate);
      }
      if (dealData.howToRedeem) {
        formData.append('howToRedeem', dealData.howToRedeem);
      }
      if (dealData.universityName) {
        formData.append('universityName', dealData.universityName);
      }
      if (dealData.isUniversitySpecific !== undefined) {
        formData.append('isUniversitySpecific', dealData.isUniversitySpecific.toString());
        console.log('Adding isUniversitySpecific to FormData:', dealData.isUniversitySpecific);
      }
      
      console.log('Sending FormData to backend');
      console.log('FormData contents:');
      for (const [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      const response = await apiClient.post('/api/deals', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Deal created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating deal:', error);
      throw error;
    }
  },

  async updateDeal(id: string, dealData: UpdateDealRequest): Promise<Deal> {
    try {
      console.log('Updating deal:', id, 'with data:', dealData);
      
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('title', dealData.title);
      formData.append('description', dealData.description);
      formData.append('discount', dealData.discount);
      formData.append('isActive', dealData.isActive.toString());
      formData.append('redeemType', dealData.redeemType);
      formData.append('categoryName', dealData.categoryName);
      formData.append('storeName', dealData.storeName);
      
      // Add optional fields if they exist
      if (dealData.image) {
        formData.append('image', dealData.image);
      }
      if (dealData.promo) {
        formData.append('promo', dealData.promo);
      }
      if (dealData.url) {
        formData.append('url', dealData.url);
      }
      if (dealData.startDate) {
        formData.append('startDate', dealData.startDate);
      }
      if (dealData.endDate) {
        formData.append('endDate', dealData.endDate);
      }
      if (dealData.howToRedeem) {
        formData.append('howToRedeem', dealData.howToRedeem);
      }
      if (dealData.universityName) {
        formData.append('universityName', dealData.universityName);
      }
      if (dealData.isUniversitySpecific !== undefined) {
        formData.append('isUniversitySpecific', dealData.isUniversitySpecific.toString());
      }
      
      console.log('Sending FormData to backend for update');
      
      const response = await apiClient.put(`/api/deals/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Deal updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating deal:', error);
      throw error;
    }
  },

  async deleteDeal(id: string): Promise<void> {
    try {
      console.log('Deleting deal:', id);
      await apiClient.delete(`/api/deals/${id}`);
      console.log('Deal deleted successfully');
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  }
};

// Keep the legacy function for backward compatibility
export const fetchDeals = dealService.getDeals;