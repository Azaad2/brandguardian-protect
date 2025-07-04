
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useRazorpay } from '@/hooks/use-razorpay';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const SubscriptionManager = () => {
  const { subscription, isLoading } = useSubscription();
  const { cancelSubscription, isLoading: isCancelling } = useRazorpay();

  if (isLoading) {
    return <div>Loading subscription details...</div>;
  }

  if (!subscription || !subscription.subscribed) {
    return null; // Show upgrade component instead
  }

  const getTierDisplayName = (tier: string) => {
    switch (tier) {
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

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
    } catch (error) {
      // Error already handled in the hook
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Current Subscription</CardTitle>
          <Badge className={getTierColor(subscription.subscription_tier)}>
            {getTierDisplayName(subscription.subscription_tier)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">Active Subscription</p>
            <p className="text-sm text-gray-600">
              Brand application limit: {subscription.brand_application_limit}
            </p>
          </div>
        </div>
        
        {subscription.subscription_end && (
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">Next billing date</p>
              <p className="text-sm text-gray-600">
                {new Date(subscription.subscription_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full" disabled={isCancelling}>
                <AlertCircle className="h-4 w-4 mr-2" />
                {isCancelling ? 'Processing...' : 'Cancel Subscription'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to cancel your subscription? Your plan will remain active 
                  until the end of the current billing cycle, after which you'll be downgraded 
                  to the free plan with 3 brand applications.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelSubscription}>
                  Yes, Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
