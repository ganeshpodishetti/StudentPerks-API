import AdminCategoriesList from '@/components/admin/AdminCategoriesList';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import CategoryFormModal from '@/components/CategoryFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCategories } from '@/hooks/useAdminCategories';

export default function AdminCategoriesPage() {
  const {
    categories,
    isLoading,
    isModalOpen,
    editingCategory,
    user,
    handleCreateCategory,
    handleEditCategory,
    handleDeleteCategory,
    handleSaveCategory,
    closeModal
  } = useAdminCategories();

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
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateCategory}
        onLogout={handleLogout}
        onDebugAuth={() => {}}
        onTestConnectivity={() => {}}
        title="Category Management"
        createButtonText="Create Category"
      />

      <AdminNavigation />

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <AdminCategoriesList 
          categories={categories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
}
