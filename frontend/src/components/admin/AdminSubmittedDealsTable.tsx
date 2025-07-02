import { Button } from '@/components/ui/button';
import { SubmittedDeal } from '@/types/SubmittedDeal';
import { CheckCircle, ExternalLink, Trash2, XCircle } from 'lucide-react';

interface AdminSubmittedDealsTableProps {
  deals: SubmittedDeal[];
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminSubmittedDealsTable({ deals, onMarkAsRead, onDelete }: AdminSubmittedDealsTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (deals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500 dark:text-neutral-400">No submitted deals found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Deal Name
            </th>
            <th className="text-left p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              URL
            </th>
            <th className="text-left p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Submitted
            </th>
            <th className="text-left p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Status
            </th>
            <th className="text-left p-2 sm:p-3 md:p-4 text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
              <td className="p-2 sm:p-3 md:p-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {deal.name}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
                    {deal.url}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-6 w-6 p-0"
                  >
                    <a
                      href={deal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  {formatDate(deal.sentAt)}
                </span>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  deal.markedAsRead 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                }`}>
                  {deal.markedAsRead ? 'Read' : 'Unread'}
                </span>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  {!deal.markedAsRead ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead(deal.id, true)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                      title="Mark as read"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMarkAsRead(deal.id, false)}
                      className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                      title="Mark as unread"
                    >
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(deal.id)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                    title="Delete"
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
