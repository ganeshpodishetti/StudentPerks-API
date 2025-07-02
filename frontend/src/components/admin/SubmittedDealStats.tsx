import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MailOpen, MessagesSquare } from 'lucide-react';

interface SubmittedDealStatsProps {
  total: number;
  unread: number;
  read: number;
}

export default function SubmittedDealStats({ total, unread, read }: SubmittedDealStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <MessagesSquare className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{total}</div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Deal submissions received
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unread</CardTitle>
          <Mail className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {unread}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Pending review
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Read</CardTitle>
          <MailOpen className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
            {read}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Already reviewed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
