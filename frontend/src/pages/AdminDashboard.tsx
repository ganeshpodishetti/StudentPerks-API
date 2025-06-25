import DealFormModal from '@/components/DealFormModal';
import AdminDealsList from '@/components/admin/AdminDealsList';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminStats from '@/components/admin/AdminStats';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export default function AdminDashboard() {
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
    debugAuth,
    testConnectivity,
    closeModal
  } = useAdminDashboard();

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-8">
      <AdminHeader 
        user={user}
        onCreateDeal={handleCreateDeal}
        onLogout={handleLogout}
        onDebugAuth={debugAuth}
        onTestConnectivity={testConnectivity}
      />

      <AdminNavigation />

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        <AdminStats deals={deals} />
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
    </div>
  );
}
