// Service for fetching categories
import axios from 'axios';

// Define response types
export interface Category {
  id: string;
  name: string;
  description?: string;
}

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Fetch all categories
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
