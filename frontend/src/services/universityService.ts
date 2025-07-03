// Service for university operations
import type {
    CreateUniversityRequest,
    CreateUniversityResponse,
    University,
    UpdateUniversityRequest
} from '../types/University';
import apiClient, { publicApiClient } from './apiClient';

// Re-export types for convenience
export type { CreateUniversityRequest, CreateUniversityResponse, University, UpdateUniversityRequest };

export const universityService = {
  // Public endpoints - no authentication required
  async getUniversities(): Promise<University[]> {
    try {
      const response = await publicApiClient.get('/api/universities');
      
      // Handle 204 No Content response (empty database)
      if (response.status === 204 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching universities:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  async getUniversity(id: string): Promise<University> {
    try {
      const response = await publicApiClient.get(`/api/universities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching university:', error);
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async createUniversity(universityData: CreateUniversityRequest): Promise<CreateUniversityResponse> {
    try {
      console.log('Creating university with data:', universityData);
      
      const formData = new FormData();
      formData.append('name', universityData.name);
      formData.append('code', universityData.code);
      
      if (universityData.country) {
        formData.append('country', universityData.country);
      }
      
      if (universityData.state) {
        formData.append('state', universityData.state);
      }
      
      if (universityData.city) {
        formData.append('city', universityData.city);
      }
      
      if (universityData.image) {
        formData.append('image', universityData.image);
      }
      
      console.log('FormData prepared for university creation');
      
      const response = await apiClient.post('/api/universities', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('University created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating university:', error);
      throw error;
    }
  },

  async updateUniversity(id: string, universityData: UpdateUniversityRequest): Promise<University> {
    try {
      console.log('Updating university:', id, 'with data:', universityData);
      
      const formData = new FormData();
      formData.append('name', universityData.name);
      formData.append('code', universityData.code);
      formData.append('isActive', universityData.isActive.toString());
      
      if (universityData.country) {
        formData.append('country', universityData.country);
      }
      
      if (universityData.state) {
        formData.append('state', universityData.state);
      }
      
      if (universityData.city) {
        formData.append('city', universityData.city);
      }
      
      if (universityData.image) {
        formData.append('image', universityData.image);
      }
      
      console.log('FormData prepared for university update');
      
      const response = await apiClient.put(`/api/universities/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('University updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating university:', error);
      throw error;
    }
  },

  async deleteUniversity(id: string): Promise<void> {
    try {
      console.log('Deleting university:', id);
      await apiClient.delete(`/api/universities/${id}`);
      console.log('University deleted successfully');
    } catch (error) {
      console.error('Error deleting university:', error);
      throw error;
    }
  }
};

// Legacy function for backward compatibility
export const fetchUniversities = universityService.getUniversities;
