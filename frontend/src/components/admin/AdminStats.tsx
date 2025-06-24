import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Deal } from '@/types/Deal';
import { Eye } from 'lucide-react';

interface AdminStatsProps {
  deals: Deal[];
}

export default function AdminStats({ deals }: AdminStatsProps) {
  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => deal.isActive).length;
  const inactiveDeals = deals.filter(deal => !deal.isActive).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md2:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Deals</CardTitle>
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalDeals}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Active Deals</CardTitle>
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{activeDeals}</div>
        </CardContent>
      </Card>
      
      <Card className="sm:col-span-2 md2:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Inactive Deals</CardTitle>
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">{inactiveDeals}</div>
        </CardContent>
      </Card>
    </div>
  );
}
