import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { University } from '@/types/University';
import { Edit, Trash2 } from 'lucide-react';

interface AdminUniversitiesTableProps {
  universities: University[];
  onEditUniversity: (university: University) => void;
  onDeleteUniversity: (universityId: string) => void;
}

export default function AdminUniversitiesTable({ universities, onEditUniversity, onDeleteUniversity }: AdminUniversitiesTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Image</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Name</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Code</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Location</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Status</th>
            <th className="text-left p-2 sm:p-3 md:p-4 font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university) => (
            <tr key={university.id} className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center">
                  {university.imageUrl ? (
                    <img 
                      src={university.imageUrl} 
                      alt={university.name || 'University'} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <img 
                        src="/no-image.svg" 
                        alt="No image available" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="font-medium text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm">{university.name}</div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-mono">
                  {university.code}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                  {[university.city, university.state, university.country].filter(Boolean).join(', ') || '-'}
                </div>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <Badge variant={university.isActive ? 'default' : 'secondary'}>
                  {university.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="p-2 sm:p-3 md:p-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditUniversity(university)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteUniversity(university.id)}
                    className="h-6 w-6 sm:h-8 sm:w-8 p-0"
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
