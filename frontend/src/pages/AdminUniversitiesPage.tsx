import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminUniversitiesList from '@/components/admin/AdminUniversitiesList';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import UniversityFormModal from '@/components/UniversityFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUniversities } from '@/hooks/useAdminUniversities';

// Export hook for university selection in other components
export const useUniversityOptions = () => {
  const { universities, isLoading } = useAdminUniversities();
  
  const universityOptions = universities?.map(university => ({
    value: university.id,
    label: university.name
  })) || [];

  return { universityOptions, isLoading };
};

export default function AdminUniversitiesPage() {
  const {
    universities,
    isLoading,
    isModalOpen,
    editingUniversity,
    user,
    handleCreateUniversity,
    handleEditUniversity,
    handleDeleteUniversity,
    handleSaveUniversity,
    closeModal
  } = useAdminUniversities();

  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout navigation={<AdminNavigation />}>
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateUniversity}
        onLogout={handleLogout}
        onTestConnectivity={() => {}}
        title="University Management"
        createButtonText="Create University"
      />

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <AdminUniversitiesList 
          universities={universities}
          onEditUniversity={handleEditUniversity}
          onDeleteUniversity={handleDeleteUniversity}
        />
      </div>

      <UniversityFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveUniversity}
        university={editingUniversity}
      />
    </AdminLayout>
  );
}
