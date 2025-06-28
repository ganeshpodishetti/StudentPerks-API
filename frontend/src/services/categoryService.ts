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
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await publicApiClient.get(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Admin endpoints - authentication required
  async createCategory(categoryData: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    try {
      console.log('Creating category with data:', categoryData);
      
      const formData = new FormData();
      formData.append('name', categoryData.name);
      
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      console.log('FormData prepared for category creation');
      
      const response = await apiClient.post('/api/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Category created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, categoryData: UpdateCategoryRequest): Promise<Category> {
    try {
      console.log('Updating category:', id, 'with data:', categoryData);
      
      const formData = new FormData();
      formData.append('name', categoryData.name);
      
      if (categoryData.description) {
        formData.append('description', categoryData.description);
      }
      
      if (categoryData.image) {
        formData.append('image', categoryData.image);
      }
      
      console.log('FormData prepared for category update');
      
      const response = await apiClient.put(`/api/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Category updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      console.log('Deleting category:', id);
      await apiClient.delete(`/api/categories/${id}`);
      console.log('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchCategories = categoryService.getCategories;