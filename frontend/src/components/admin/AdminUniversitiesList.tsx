import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { University } from '@/types/University';
import AdminUniversitiesCards from './AdminUniversitiesCards';
import AdminUniversitiesTable from './AdminUniversitiesTable';

interface AdminUniversitiesListProps {
  universities: University[];
  onEditUniversity: (university: University) => void;
  onDeleteUniversity: (universityId: string) => void;
}

export default function AdminUniversitiesList({ universities, onEditUniversity, onDeleteUniversity }: AdminUniversitiesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Universities</CardTitle>
        <CardDescription>
          Manage your universities, edit details, or remove outdated universities.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-3 md:p-6">
        {/* Desktop Table View */}
        <AdminUniversitiesTable 
          universities={universities}
          onEditUniversity={onEditUniversity}
          onDeleteUniversity={onDeleteUniversity}
        />

        {/* Mobile Card View */}
        <AdminUniversitiesCards 
          universities={universities}
          onEditUniversity={onEditUniversity}
          onDeleteUniversity={onDeleteUniversity}
        />

        {universities.length === 0 && (
          <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
            No universities found. Create your first university to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
