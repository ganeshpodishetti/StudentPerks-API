import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminStoresList from '@/components/admin/AdminStoresList';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import StoreFormModal from '@/components/StoreFormModal';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminStores } from '@/hooks/useAdminStores';

export default function AdminStoresPage() {
  const {
    stores,
    isLoading,
    isModalOpen,
    editingStore,
    user,
    handleCreateStore,
    handleEditStore,
    handleDeleteStore,
    handleSaveStore,
    closeModal
  } = useAdminStores();

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
        onCreateDeal={handleCreateStore}
        onLogout={handleLogout}
        onTestConnectivity={() => {}}
        title="Store Management"
        createButtonText="Create Store"
      />

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <AdminStoresList 
          stores={stores}
          onEditStore={handleEditStore}
          onDeleteStore={handleDeleteStore}
        />
      </div>

      <StoreFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveStore}
        store={editingStore}
      />
    </AdminLayout>
  );
}
