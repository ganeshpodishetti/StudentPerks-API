import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SubmittedDeal } from '@/types/SubmittedDeal';
import { CheckCircle, ExternalLink, Trash2, XCircle } from 'lucide-react';

interface AdminSubmittedDealsCardsProps {
  deals: SubmittedDeal[];
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminSubmittedDealsCards({ deals, onMarkAsRead, onDelete }: AdminSubmittedDealsCardsProps) {
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
    <div className="grid gap-3 sm:gap-4">
      {deals.map((deal) => (
        <Card key={deal.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">
                  {deal.name}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xs">
                    {deal.url}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-5 w-5 p-0 flex-shrink-0"
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
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                    deal.markedAsRead 
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {deal.markedAsRead ? 'Read' : 'Unread'}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDate(deal.sentAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {!deal.markedAsRead ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(deal.id, true)}
                    className="h-6 w-6 p-0"
                    title="Mark as read"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(deal.id, false)}
                    className="h-6 w-6 p-0"
                    title="Mark as unread"
                  >
                    <XCircle className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(deal.id)}
                  className="h-6 w-6 p-0"
                  title="Delete"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
