
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Clock, TrendingUp, Lock } from 'lucide-react';
import { getStatusIcon } from './BrandStatusIcons';

interface Brand {
  id: string;
  displayName: string;
  displayDepartment?: string;
  website_url?: string;
  description?: string;
  contact_email: string;
  logo_url?: string;
  categories?: string[];
  approval_rate?: number;
  response_time?: number;
  applicationStatus?: string | null;
}

interface BrandCardProps {
  brand: Brand;
  onApply: (brandId: string) => void;
  isApplying: boolean;
  canApply?: boolean;
}

const BrandCard = ({ brand, onApply, isApplying, canApply = true }: BrandCardProps) => {
  const hasApplied = brand.applicationStatus !== null;
  const canApplyToBrand = canApply && !hasApplied;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionButton = () => {
    if (hasApplied) {
      return (
        <Badge className={`${getStatusColor(brand.applicationStatus!)} font-medium`}>
          {getStatusIcon(brand.applicationStatus!) && (
            <span className="mr-1">
              {getStatusIcon(brand.applicationStatus!)}
            </span>
          )}
          {brand.applicationStatus!.charAt(0).toUpperCase() + brand.applicationStatus!.slice(1)}
        </Badge>
      );
    }

    if (!canApply) {
      return (
        <Button variant="outline" disabled className="w-full">
          <Lock className="mr-2 h-4 w-4" />
          Upgrade to Apply
        </Button>
      );
    }

    return (
      <Button 
        onClick={() => onApply(brand.id)}
        disabled={isApplying}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isApplying ? 'Applying...' : 'Apply Now'}
      </Button>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200/80">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {brand.displayName}
              </h3>
              {brand.displayDepartment && (
                <p className="text-sm text-gray-600">{brand.displayDepartment}</p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {brand.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{brand.description}</p>
          )}

          {/* Categories */}
          {brand.categories && brand.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {brand.categories.slice(0, 2).map((category, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {category}
                </Badge>
              ))}
              {brand.categories.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{brand.categories.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {brand.approval_rate && (
              <div className="flex items-center text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                <span>{brand.approval_rate}% approval</span>
              </div>
            )}
            {brand.response_time && (
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                <span>{brand.response_time}h response</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-2">
            {getActionButton()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandCard;
