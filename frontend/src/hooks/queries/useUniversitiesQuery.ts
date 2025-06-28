import { useErrorHandler } from '@/contexts/ErrorContext';
import { universityService } from '@/services/universityService';
import { CreateUniversityRequest, UpdateUniversityRequest } from '@/types/University';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const UNIVERSITIES_QUERY_KEY = 'universities';

// Get all universities
export const useUniversitiesQuery = () => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: [UNIVERSITIES_QUERY_KEY],
    queryFn: async () => {
      try {
        return await universityService.getUniversities();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

// Get single university
export const useUniversityQuery = (id: string) => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: [UNIVERSITIES_QUERY_KEY, id],
    queryFn: async () => {
      try {
        return await universityService.getUniversity(id);
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Create university mutation
export const useCreateUniversityMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (data: CreateUniversityRequest) => universityService.createUniversity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNIVERSITIES_QUERY_KEY] });
      showSuccess('University created successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Update university mutation
export const useUpdateUniversityMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUniversityRequest }) => 
      universityService.updateUniversity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNIVERSITIES_QUERY_KEY] });
      showSuccess('University updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Delete university mutation
export const useDeleteUniversityMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (id: string) => universityService.deleteUniversity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UNIVERSITIES_QUERY_KEY] });
      showSuccess('University deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};
