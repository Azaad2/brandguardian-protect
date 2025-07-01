
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface UsageIndicatorProps {
  currentApplications: number;
  limit: number;
  subscriptionTier: string;
}

const UsageIndicator = ({ currentApplications, limit, subscriptionTier }: UsageIndicatorProps) => {
  const percentage = (currentApplications / limit) * 100;
  const remaining = Math.max(0, limit - currentApplications);
  const isAtLimit = currentApplications >= limit;
  const isNearLimit = percentage >= 80;

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
      case 'free': return 'Free Plan';
      case 'basic': return 'Basic Plan';
      case 'premium': return 'Premium Plan';
      case 'enterprise': return 'Enterprise Plan';
      default: return 'Free Plan';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'enterprise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isAtLimit ? (
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          ) : (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          <h3 className="font-semibold text-gray-900">Brand Application Usage</h3>
        </div>
        <Badge className={getTierColor(subscriptionTier)}>
          {getTierDisplayName(subscriptionTier)}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{currentApplications} of {limit} applications used</span>
          <span>{remaining} remaining</span>
        </div>
        
        <Progress 
          value={percentage} 
          className={`h-2 ${isAtLimit ? '[&>div]:bg-red-500' : isNearLimit ? '[&>div]:bg-amber-500' : '[&>div]:bg-green-500'}`}
        />
        
        {isAtLimit && (
          <p className="text-sm text-amber-600 mt-2">
            You've reached your application limit. Upgrade to apply to more brands.
          </p>
        )}
        
        {isNearLimit && !isAtLimit && (
          <p className="text-sm text-amber-600 mt-2">
            You're approaching your application limit. Consider upgrading soon.
          </p>
        )}
      </div>
    </div>
  );
};

export default UsageIndicator;
