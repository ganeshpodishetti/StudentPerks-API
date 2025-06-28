export type RedeemType = 'Online' | 'InStore' | 'Both' | 'Unknown';

// Base Deal interface
export interface Deal {
  id: string;
  title: string;
  description: string;
  discount?: string;
  imageUrl?: string;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: RedeemType;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  categoryName: string;
  storeName: string;
  universityName?: string;
  universityImageUrl?: string;
}

// Request types for creating and updating deals
export interface CreateDealRequest {
  title: string;
  description: string;
  discount: string;
  image?: File;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  isUniversitySpecific?: boolean;
  categoryName: string;
  storeName: string;
  universityName?: string;
}

export interface UpdateDealRequest {
  title: string;
  description: string;
  discount: string;
  image?: File;
  promo?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  isUniversitySpecific?: boolean;
  categoryName: string;
  storeName: string;
  universityName?: string;
}

// Response types for different API endpoints
export interface GetDealResponse {
  id: string;
  title: string;
  description: string;
  discount: string;
  promo?: string;
  imageUrl?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  isUniversitySpecific: boolean;
  categoryName: string;
  storeName: string;
  universityName?: string;
}

export interface GetDealsByCategoryResponse {
  id: string;
  title: string;
  description: string;
  discount: string;
  promo?: string;
  dealImageUrl?: string;
  categoryImageUrl?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  categoryName: string;
}

export interface GetDealsByStoreResponse {
  id: string;
  title: string;
  description: string;
  discount: string;
  promo?: string;
  imageUrl?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  storeName: string;
}

export interface GetDealsByUniversityResponse {
  id: string;
  title: string;
  description: string;
  discount: string;
  promo?: string;
  dealImageUrl?: string;
  universityImageUrl?: string;
  isActive: boolean;
  url: string;
  redeemType: string;
  howToRedeem?: string;
  startDate?: string;
  endDate?: string;
  universityName: string;
}

export interface DealResponse {
  id: string;
}