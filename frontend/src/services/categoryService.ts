// Service for fetching categories
import axios from 'axios';

// Define response types
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5254';

// Create axios instance
const categoryApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await categoryApi.get('/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getCategory(id: string): Promise<Category> {
    try {
      const response = await categoryApi.get(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  async createCategory(categoryData: { name: string; description?: string }): Promise<Category> {
    try {
      const response = await categoryApi.post('/api/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, categoryData: { name: string; description?: string }): Promise<Category> {
    try {
      const response = await categoryApi.put(`/api/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await categoryApi.delete(`/api/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};

// Keep legacy function for backward compatibility
export const fetchCategories = categoryService.getCategories;
