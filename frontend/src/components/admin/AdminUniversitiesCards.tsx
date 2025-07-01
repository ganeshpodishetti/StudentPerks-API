import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { University } from '@/types/University';
import { Edit, Trash2 } from 'lucide-react';

interface AdminUniversitiesCardsProps {
  universities: University[];
  onEditUniversity: (university: University) => void;
  onDeleteUniversity: (universityId: string) => void;
}

export default function AdminUniversitiesCards({ universities, onEditUniversity, onDeleteUniversity }: AdminUniversitiesCardsProps) {
  return (
    <div className="md:hidden space-y-3">
      {universities.map((university) => (
        <Card key={university.id} className="p-3">
          <CardContent className="p-0 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0">
                  {university.imageUrl ? (
                    <img 
                      src={university.imageUrl} 
                      alt={university.name || 'University'} 
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <img 
                        src="/no-image.svg" 
                        alt="No image available" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 text-sm">{university.name}</h3>
                    <Badge variant={university.isActive ? 'default' : 'secondary'} className="text-xs">
                      {university.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 font-mono mb-1">
                    {university.code}
                  </p>
                  {[university.city, university.state, university.country].filter(Boolean).length > 0 && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {[university.city, university.state, university.country].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditUniversity(university)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteUniversity(university.id)}
                  className="h-6 w-6 p-0"
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
