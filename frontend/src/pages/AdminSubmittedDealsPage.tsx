import AdminHeader from '@/components/admin/AdminHeader';
import AdminLoadingSpinner from '@/components/admin/AdminLoadingSpinner';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminSubmittedDealsList from '@/components/admin/AdminSubmittedDealsList';
import SubmittedDealStats from '@/components/admin/SubmittedDealStats';
import { AdminLayout } from '@/components/admin/shared/AdminLayout';
import { useAdminSubmittedDeals } from '@/hooks/useAdminSubmittedDeals';

export default function AdminSubmittedDealsPage() {
  const {
    deals,
    isLoading,
    user,
    stats,
    handleMarkAsRead,
    handleDelete,
    handleLogout,
    testConnectivity,
  } = useAdminSubmittedDeals();

  if (isLoading) {
    return <AdminLoadingSpinner />;
  }

  return (
    <AdminLayout
      navigation={<AdminNavigation />}
    >
      <AdminHeader 
        user={user}
        onLogout={handleLogout}
        onTestConnectivity={testConnectivity}
        title="Submitted Deals"
      />

      <div className="grid gap-3 sm:gap-4 md:gap-6">
        {/* Stats */}
        <SubmittedDealStats {...stats} />

        {/* Submitted Deals List */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Deal Submissions
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Review and manage user-submitted deals
            </p>
          </div>
          <div className="p-4">
            <AdminSubmittedDealsList 
              deals={deals}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
