import DealFormModal from '@/components/DealFormModal';
import AdminDealsList from '@/components/admin/AdminDealsList';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { useAdminDeals } from '@/hooks/useAdminDeals';

export default function AdminDealsPage() {
  const {
    deals,
    isLoading,
    isModalOpen,
    editingDeal,
    user,
    handleCreateDeal,
    handleEditDeal,
    handleDeleteDeal,
    handleSaveDeal,
    handleLogout,
    testConnectivity,
    closeModal
  } = useAdminDeals();

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout
      navigation={<AdminNavigation />}
    >
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateDeal}
        onLogout={handleLogout}
        onTestConnectivity={testConnectivity}
        title="Deals Management"
      />

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <AdminDealsList 
          deals={deals}
          onEditDeal={handleEditDeal}
          onDeleteDeal={handleDeleteDeal}
        />
      </div>

      <DealFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveDeal}
        deal={editingDeal}
      />
    </AdminLayout>
  );
}
