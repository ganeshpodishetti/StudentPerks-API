import { useAuth } from '@/contexts/AuthContext';
import {
    useCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation
} from '@/hooks/queries/useCategoriesQuery';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/services/categoryService';
import { useState } from 'react';

export const useAdminCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { user } = useAuth();

  // React Query hooks
  const { data: categories = [], isLoading } = useCategoriesQuery();
  const createCategoryMutation = useCreateCategoryMutation();
  const updateCategoryMutation = useUpdateCategoryMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    deleteCategoryMutation.mutate(categoryId);
  };

  const handleSaveCategory = async (categoryData: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      if (editingCategory) {
        await updateCategoryMutation.mutateAsync({ 
          id: editingCategory.id, 
          data: categoryData as UpdateCategoryRequest 
        });
      } else {
        await createCategoryMutation.mutateAsync(categoryData as CreateCategoryRequest);
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Error saving category:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return {
    categories,
    isLoading: isLoading || createCategoryMutation.isPending || updateCategoryMutation.isPending,
    isModalOpen,
    editingCategory,
    user,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    closeModal,
    isDeleting: deleteCategoryMutation.isPending,
    isSaving: createCategoryMutation.isPending || updateCategoryMutation.isPending,
  };
};
