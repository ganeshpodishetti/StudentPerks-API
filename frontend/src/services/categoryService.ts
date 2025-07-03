// Service for fetching categories
import apiClient, { publicApiClient } from './apiClient';

// Define response types
export interface Category {
  id: string;
  name?: string;
  description?: string;
  imageUrl?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
}

export interface CreateCategoryResponse {
  id: string;
  imageUrl?: string;
}

export const categoryService = {
  // Public endpoints - no authentication required
  async getCategories(): Promise<Category[]> {
    try {
      const response = await publicApiClient.get('/api/categories');
      
      // Handle 204 No Content response (empty database)
      if (response.status === 204 || !response.data) {
        return [];
      }
      
      // Ensure we always return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await publicApiClient.get(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async createCategory(categoryData: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      const response = await apiClient.post('/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category> {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.name);
      
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      const response = await apiClient.put(`/api/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/categories/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchCategories = categoryService.getCategories;