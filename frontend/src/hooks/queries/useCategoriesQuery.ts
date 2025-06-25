import { useErrorHandler } from '@/contexts/ErrorContext';
import { categoryService, CreateCategoryRequest, UpdateCategoryRequest } from '@/services/categoryService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const CATEGORIES_QUERY_KEY = 'categories';

// Get all categories
export const useCategoriesQuery = () => {
  const { handleApiError } = useErrorHandler();

  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: async () => {
      try {
        return await categoryService.getCategories();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

// Create category mutation
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      showSuccess('Category created successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Update category mutation
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) => 
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      showSuccess('Category updated successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};

// Delete category mutation
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { handleApiError, showSuccess } = useErrorHandler();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      showSuccess('Category deleted successfully');
    },
    onError: (error: any) => {
      handleApiError(error);
    },
  });
};
