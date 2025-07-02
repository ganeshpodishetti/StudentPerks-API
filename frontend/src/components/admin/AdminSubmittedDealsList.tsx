import { SubmittedDeal } from '@/types/SubmittedDeal';
import { useEffect, useState } from 'react';
import AdminSubmittedDealsCards from './AdminSubmittedDealsCards';
import AdminSubmittedDealsTable from './AdminSubmittedDealsTable';

interface AdminSubmittedDealsListProps {
  deals: SubmittedDeal[];
  onMarkAsRead: (id: string, isRead: boolean) => void;
  onDelete: (id: string) => void;
}

export default function AdminSubmittedDealsList({ deals, onMarkAsRead, onDelete }: AdminSubmittedDealsListProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isMobile) {
    return (
      <AdminSubmittedDealsCards 
        deals={deals}
        onMarkAsRead={onMarkAsRead}
        onDelete={onDelete}
      />
    );
  }

  return (
    <AdminSubmittedDealsTable 
      deals={deals}
      onMarkAsRead={onMarkAsRead}
      onDelete={onDelete}
    />
  );
}
