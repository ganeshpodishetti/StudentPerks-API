// University types based on API specifications
export interface University {
  id: string;
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CreateUniversityRequest {
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  image?: File;
}

export interface UpdateUniversityRequest {
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
  isActive: boolean;
  image?: File;
}

export interface CreateUniversityResponse {
  id: string;
  imageUrl?: string;
}

export interface UniversityResponse {
  id: string;
  name: string;
  code: string;
  country?: string;
  state?: string;
  city?: string;
    imageUrl?: string;
    isActive?: boolean;
}
