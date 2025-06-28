import { Button } from '@/components/ui/button';
import { Deal } from '@/types/Deal';
import { Edit, Trash2 } from 'lucide-react';

interface AdminDealsTableProps {
  deals: Deal[];
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}

export default function AdminDealsTable({ deals, onEditDeal, onDeleteDeal }: AdminDealsTableProps) {
  return (
    <div className="hidden md2:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Title</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Store</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Category</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Discount</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Status</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="p-2 sm:p-3 md:p-4">
                <div className="font-medium text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">{deal.title}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[120px] sm:max-w-xs">
                  {deal.description}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">{deal.storeName}</td>
              <td className="p-2 sm:p-3 md:p-4 text-neutral-700 dark:text-neutral-300 text-xs sm:text-sm">{deal.categoryName}</td>
              <td className="p-2 sm:p-3 md:p-4">
                <span className="bg-black text-white dark:bg-white dark:text-black px-1 sm:px-2 py-1 rounded text-xs">
                  {deal.discount}
                </span>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <span className={`px-1 sm:px-2 py-1 rounded text-xs ${
                  deal.isActive 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {deal.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditDeal(deal)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteDeal(deal.id)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
