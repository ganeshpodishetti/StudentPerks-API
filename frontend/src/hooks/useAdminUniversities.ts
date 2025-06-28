import { useAuth } from '@/contexts/AuthContext';
import {
    useCreateUniversityMutation,
    useDeleteUniversityMutation,
    useUniversitiesQuery,
    useUpdateUniversityMutation
} from '@/hooks/queries/useUniversitiesQuery';
import { CreateUniversityRequest, University, UpdateUniversityRequest } from '@/types/University';
import { useState } from 'react';

export const useAdminUniversities = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const { user } = useAuth();

  // React Query hooks
  const { data: universities = [], isLoading } = useUniversitiesQuery();
  const createUniversityMutation = useCreateUniversityMutation();
  const updateUniversityMutation = useUpdateUniversityMutation();
  const deleteUniversityMutation = useDeleteUniversityMutation();

  const handleCreateUniversity = () => {
    setEditingUniversity(null);
    setIsModalOpen(true);
  };

  const handleEditUniversity = (university: University) => {
    setEditingUniversity(university);
    setIsModalOpen(true);
  };

  const handleDeleteUniversity = async (universityId: string) => {
    if (!window.confirm('Are you sure you want to delete this university?')) {
      return;
    }

    deleteUniversityMutation.mutate(universityId);
  };

  const handleSaveUniversity = async (universityData: CreateUniversityRequest | UpdateUniversityRequest) => {
    try {
      if (editingUniversity) {
        await updateUniversityMutation.mutateAsync({ 
          id: editingUniversity.id, 
          data: universityData as UpdateUniversityRequest 
        });
      } else {
        await createUniversityMutation.mutateAsync(universityData as CreateUniversityRequest);
      }
      closeModal();
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Error saving university:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUniversity(null);
  };

  return {
    universities,
    isLoading: isLoading || createUniversityMutation.isPending || updateUniversityMutation.isPending,
    isModalOpen,
    editingUniversity,
    user,
    handleCreateUniversity,
    handleEditUniversity,
    handleDeleteUniversity,
    handleSaveUniversity,
    closeModal,
    isDeleting: deleteUniversityMutation.isPending,
    isSaving: createUniversityMutation.isPending || updateUniversityMutation.isPending,
  };
};
