import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Deal } from '@/types/Deal';
import AdminDealsCards from './AdminDealsCards';
import AdminDealsTable from './AdminDealsTable';

interface AdminDealsListProps {
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}

export default function AdminDealsList({ deals, onEditDeal, onDeleteDeal }: AdminDealsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Deals</CardTitle>
        <CardDescription>
          Manage your deals, edit details, or remove outdated offers.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-3 md:p-6">
        {/* Desktop Table View */}
        <AdminDealsTable 
          deals={deals}
          onEditDeal={onEditDeal}
          onDeleteDeal={onDeleteDeal}
        />

        {/* Mobile Card View */}
        <AdminDealsCards 
          deals={deals}
          onEditDeal={onEditDeal}
          onDeleteDeal={onDeleteDeal}
        />

        {deals.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No deals found. Create your first deal to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
