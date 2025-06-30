
import { Card, CardContent } from "@/components/ui/card";

interface BrandsEmptyStateProps {
  searchQuery: string;
}

const BrandsEmptyState = ({ searchQuery }: BrandsEmptyStateProps) => {
  return (
    <div className="flex items-center justify-center h-96">
      <Card className="max-w-md text-center">
        <CardContent className="py-12">
          <div className="text-gray-500 text-lg mb-2">
            {searchQuery ? 'No brands match your search' : 'No brands available'}
          </div>
          <p className="text-gray-400">
            {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new opportunities!'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandsEmptyState;
