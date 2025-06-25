import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from 'react';

interface DealSkeletonProps {
  count?: number;
}

const DealSkeleton: React.FC<DealSkeletonProps> = ({ count = 9 }) => {
  return (
    <div>
      {/* Skeleton for filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="w-full md:w-64">
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </div>
      
      {/* Skeleton for category filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-6 w-22" />
        </div>
      </div>
      
      {/* Skeleton for deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(count).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden flex flex-col h-full">
            {/* Image skeleton */}
            <div className="relative aspect-[3/2] bg-neutral-50 dark:bg-neutral-900">
              <Skeleton className="w-full h-full" />
              {/* Discount badge skeleton */}
              <div className="absolute top-3 right-3">
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-full mb-2" />
            </CardHeader>
            
            <CardContent className="p-4 pt-2 flex-grow">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6 mb-6" />
              
              <div className="bg-neutral-50 dark:bg-neutral-900 p-3 rounded-sm mb-3 border border-neutral-100 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-0.5">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Skeleton for pagination */}
      <div className="flex justify-center my-8">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
};

export default DealSkeleton;
