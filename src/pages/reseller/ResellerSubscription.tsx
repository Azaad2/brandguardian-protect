import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import SubscriptionManager from '@/components/reseller/subscription/SubscriptionManager';
import SubscriptionUpgrade from '@/components/reseller/subscription/SubscriptionUpgrade';
import SubscriptionPlanComparison from '@/components/reseller/subscription/SubscriptionPlanComparison';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useBrandApplications } from '@/hooks/use-brand-applications';

const ResellerSubscription = () => {
  const { subscription, isLoading } = useSubscription();
  const { applications } = useBrandApplications();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and billing</p>
        </div>
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const currentApplications = applications?.length || 0;
  const currentLimit = subscription?.brand_application_limit || 3;
  const isSubscribed = subscription?.subscribed || false;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and unlock premium features</p>
      </div>

      {/* Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
          <CardDescription>Track your brand applications and subscription benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <p className="text-2xl font-bold capitalize">
                {subscription?.subscription_tier || 'Free'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Brand Applications</p>
              <p className="text-2xl font-bold">
                {currentApplications} / {currentLimit === 999999 ? '∞' : currentLimit}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-2xl font-bold">
                {isSubscribed ? (
                  <span className="text-green-600">Active</span>
                ) : (
                  <span className="text-muted-foreground">Free Tier</span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free Tier Notice */}
      {!isSubscribed && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited Access on Free Plan</AlertTitle>
          <AlertDescription>
            You're currently on the free plan with limited brand applications. Upgrade to unlock:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Unlimited brand applications</li>
              <li>Priority support (faster response times)</li>
              <li>Advanced analytics and insights</li>
              <li>Faster brand approval process</li>
              <li>Access to exclusive premium brands</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Show active subscription manager or upgrade options */}
      {isSubscribed ? (
        <SubscriptionManager />
      ) : showUpgrade ? (
        <Card>
          <CardHeader>
            <CardTitle>Upgrade Your Plan</CardTitle>
            <CardDescription>Select a plan that fits your wholesale business needs</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionUpgrade 
              currentApplications={currentApplications}
              currentLimit={currentLimit}
            />
          </CardContent>
        </Card>
      ) : (
        <SubscriptionPlanComparison onUpgrade={() => setShowUpgrade(true)} />
      )}
    </div>
  );
};

export default ResellerSubscription;
