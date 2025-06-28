import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from 'react';
import { University, fetchUniversities } from '../services/universityService';

const UniversitiesPage: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUniversity, setSelectedUniversity] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUniversities = async () => {
      setLoading(true);
      try {
        const universitiesData = await fetchUniversities();
        setUniversities(universitiesData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading universities:", err);
        setError("Failed to load universities. Please try again later.");
        setLoading(false);
        
        toast({
          title: "Error",
          description: "Failed to load universities. Please try again later.",
          variant: "destructive",
        });
      }
    };

    loadUniversities();
  }, [toast]);

  const handleUniversitySelect = (universityId: string) => {
    setSelectedUniversity(universityId);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Universities</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse universities and discover exclusive student deals and offers.
        </p>
      </div>

      {universities.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Universities Found</h2>
          <p className="text-gray-500 dark:text-gray-400">
            We're working on adding universities to our platform. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <div
              key={university.id}
              className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedUniversity === university.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              onClick={() => handleUniversitySelect(university.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {university.imageUrl ? (
                    <img
                      src={university.imageUrl}
                      alt={university.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {university.name.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {university.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-mono mb-1">
                    {university.code}
                  </p>
                  {[university.city, university.state, university.country].filter(Boolean).length > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {[university.city, university.state, university.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UniversitiesPage;
