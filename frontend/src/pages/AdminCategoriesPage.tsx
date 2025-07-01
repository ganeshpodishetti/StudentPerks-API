import AdminCategoriesList from '@/components/admin/AdminCategoriesList';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
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
    <AdminLayout navigation={<AdminNavigation />}>
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateCategory}
        onLogout={handleLogout}
        onTestConnectivity={() => {}}
        title="Category Management"
        createButtonText="Create Category"
      />

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
    </AdminLayout>
  );
}
