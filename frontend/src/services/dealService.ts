/// <reference types="vite/client" />
import axios from 'axios';
import { Deal } from '../types/Deal';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const fetchDeals = async (): Promise<Deal[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/deals`);
    return response.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }
};