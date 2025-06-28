import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDealsByUniversityQuery } from '@/hooks/queries/useDealsQuery';
import { useUniversityQuery } from '@/hooks/queries/useUniversitiesQuery';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DealCard from '../components/DealCard';

const UniversityDealsPage: React.FC = () => {
  const { universityId } = useParams<{ universityId: string }>();
  const navigate = useNavigate();

  // Get university details
  const { 
    data: university, 
    isLoading: universityLoading, 
    error: universityError 
  } = useUniversityQuery(universityId || '');

  // Get deals for this university
  const { 
    data: deals = [], 
    isLoading: dealsLoading, 
    error: dealsError 
  } = useDealsByUniversityQuery(university?.name || '');

  const isLoading = universityLoading || dealsLoading;
  const hasError = universityError || dealsError;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-32 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (hasError || !university) {
    return (
      <div className="container mx-auto p-4">
        <Button
          variant="outline"
          onClick={() => navigate('/universities')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Universities
        </Button>
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">
            {universityError 
              ? 'Failed to load university details' 
              : dealsError 
              ? 'Failed to load deals for this university' 
              : 'University not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Back button */}
      <Button
        variant="outline"
        onClick={() => navigate('/universities')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Universities
      </Button>

      {/* University header */}
      <div className="mb-8">
        <div className="flex items-center space-x-6 mb-4">
          <div className="flex-shrink-0">
            {university.imageUrl ? (
              <img
                src={university.imageUrl}
                alt={university.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {university.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {university.name}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-mono mb-1">
              {university.code}
            </p>
            {[university.city, university.state, university.country].filter(Boolean).length > 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                {[university.city, university.state, university.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Exclusive student deals and offers for {university.name} students
        </p>
      </div>

      {/* Deals section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Available Deals ({deals.length})
        </h2>

        {deals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Deals Available Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We're working on adding exclusive deals for {university.name} students. 
              Check back soon for exciting offers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                showUniversityInfo={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDealsPage;
