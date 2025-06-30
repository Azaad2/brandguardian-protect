
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStatusIcon, getStatusBadge } from "./BrandStatusIcons";

interface BrandCardProps {
  brand: any;
  onApply: (brandId: string) => void;
  isApplying: boolean;
}

const BrandCard = ({ brand, onApply, isApplying }: BrandCardProps) => {
  const handleApply = () => {
    onApply(brand.id);
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-4 flex-1">
            {brand.logo_url && (
              <div className="flex-shrink-0">
                <img 
                  src={brand.logo_url} 
                  alt={`${brand.displayName} logo`}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                {brand.displayDepartment || brand.displayName}
              </CardTitle>
              {brand.displayDepartment && brand.displayDepartment !== brand.displayName && (
                <p className="text-sm font-medium text-gray-500 mb-2">
                  by {brand.displayName}
                </p>
              )}
              
              <div className="flex flex-wrap gap-3 text-sm">
                {brand.approval_rate && (
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <span className="text-green-700 font-semibold">{brand.approval_rate}%</span>
                    <span className="text-green-600 text-xs">approval</span>
                  </div>
                )}
                {brand.response_time && (
                  <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                    <span className="text-blue-700 font-semibold">{brand.response_time}h</span>
                    <span className="text-blue-600 text-xs">response</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            {getStatusIcon(brand.applicationStatus)}
          </div>
        </div>
        {brand.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {brand.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {brand.categories && brand.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {brand.categories.slice(0, 3).map((category: string) => (
              <Badge key={category} variant="outline" className="text-xs font-medium px-2 py-1 bg-gray-50">
                {category}
              </Badge>
            ))}
            {brand.categories.length > 3 && (
              <Badge variant="outline" className="text-xs font-medium px-2 py-1 bg-gray-50">
                +{brand.categories.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          {brand.applicationStatus ? (
            getStatusBadge(brand.applicationStatus)
          ) : (
            <Button 
              onClick={handleApply}
              disabled={isApplying}
              className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </Button>
          )}

          {brand.applicationStatus === 'approved' && (
            <Button variant="outline" className="w-full h-11 text-base font-semibold border-2 hover:bg-gray-50" size="lg">
              View Catalog
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
