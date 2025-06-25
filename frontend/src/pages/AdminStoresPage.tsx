import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminStoresList from '@/components/admin/AdminStoresList';
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
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateStore}
        onLogout={handleLogout}
        onDebugAuth={() => {}}
        onTestConnectivity={() => {}}
        title="Store Management"
        createButtonText="Create Store"
      />

      <AdminNavigation />

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
    </div>
  );
}
