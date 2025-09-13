
import { Card, CardContent } from "@/components/ui/card";
import { FilterOptions } from '@/hooks/use-brand-filters';

interface BrandsEmptyStateProps {
  searchQuery: string;
  filters?: FilterOptions;
}

const BrandsEmptyState = ({ searchQuery, filters }: BrandsEmptyStateProps) => {
  const hasActiveFilters = filters && (
    filters.applicationStatus.length > 0 || 
    filters.followUpActions.length > 0 || 
    filters.timeFilters.length > 0
  );

  const getEmptyMessage = () => {
    if (searchQuery && hasActiveFilters) {
      return {
        title: 'No brands match your search and filters',
        description: 'Try adjusting your search terms or removing some filters'
      };
    } else if (searchQuery) {
      return {
        title: 'No brands match your search',
        description: 'Try adjusting your search terms'
      };
    } else if (hasActiveFilters) {
      return {
        title: 'No brands match your current filters',
        description: 'Try adjusting or removing some filters to see more brands'
      };
    } else {
      return {
        title: 'No brands available',
        description: 'Check back later for new opportunities!'
      };
    }
  };

  const message = getEmptyMessage();
  return (
    <div className="flex items-center justify-center h-96">
      <Card className="max-w-md text-center">
        <CardContent className="py-12">
          <div className="text-gray-500 text-lg mb-2">
            {message.title}
          </div>
          <p className="text-gray-400">
            {message.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandsEmptyState;
