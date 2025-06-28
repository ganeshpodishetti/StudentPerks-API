import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Percent, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface DealStatsProps {
  totalDeals: number;
  activeDeals: number;
  expiredDeals: number;
  expiringSoon: number;
  averageDiscount?: string;
  topCategory?: string;
  topStore?: string;
  universitySpecific?: number;
  className?: string;
}

const DealStats: React.FC<DealStatsProps> = ({
  totalDeals,
  activeDeals,
  expiredDeals,
  expiringSoon,
  averageDiscount,
  topCategory,
  topStore,
  universitySpecific = 0,
  className
}) => {
  const stats = [
    {
      title: "Total Deals",
      value: totalDeals,
      icon: TrendingUp,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      title: "Active Deals",
      value: activeDeals,
      icon: Calendar,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20"
    },
    {
      title: "Expiring Soon",
      value: expiringSoon,
      icon: Clock,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/20"
    },
    {
      title: "Expired",
      value: expiredDeals,
      icon: Clock,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20"
    }
  ];

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {averageDiscount && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                <Percent className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Average Discount
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {averageDiscount}
                </p>
              </div>
            </div>
          </Card>
        )}

        {topCategory && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/20">
                <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Top Category
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {topCategory}
                </p>
              </div>
            </div>
          </Card>
        )}

        {universitySpecific > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/20">
                <Users className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  University Exclusive
                </p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {universitySpecific}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Quick Info Badges */}
      <div className="flex flex-wrap gap-2">
        {topStore && (
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Top Store: {topStore}
          </Badge>
        )}
        {activeDeals > 0 && (
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800">
            <Calendar className="h-3 w-3" />
            {Math.round((activeDeals / totalDeals) * 100)}% Active
          </Badge>
        )}
        {expiringSoon > 0 && (
          <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-200">
            <Clock className="h-3 w-3" />
            {expiringSoon} expiring soon
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DealStats;
