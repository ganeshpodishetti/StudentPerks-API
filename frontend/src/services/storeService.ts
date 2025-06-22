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
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Fetch all stores
export const fetchStores = async (): Promise<Store[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
};
