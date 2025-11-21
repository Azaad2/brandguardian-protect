import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import SubscriptionManager from '@/components/reseller/subscription/SubscriptionManager';
import SubscriptionUpgrade from '@/components/reseller/subscription/SubscriptionUpgrade';
import SubscriptionPlanComparison from '@/components/reseller/subscription/SubscriptionPlanComparison';
import { FAQSection } from '@/components/reseller/subscription/FAQSection';
import UsageIndicator from '@/components/reseller/subscription/UsageIndicator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useBrandApplications } from '@/hooks/use-brand-applications';
import { useResellerMessages } from '@/hooks/use-reseller-messages';
import { format } from 'date-fns';

const ResellerSubscription = () => {
  const { subscription, isLoading } = useSubscription();
  const { applications } = useBrandApplications();
  const { messages } = useResellerMessages();
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
  const currentLimit = subscription?.brand_application_limit || 999999;
  const isSubscribed = subscription?.subscribed || false;
  const subscriptionTier = subscription?.subscription_tier || 'free';
  
  // Calculate usage stats
  const messageCount = messages?.length || 0;
  const pendingApplications = applications?.filter(app => app.status === 'pending').length || 0;
  const approvedApplications = applications?.filter(app => app.status === 'approved').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription and unlock premium features</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage & Analytics</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan Card */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription details and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan</p>
                  <p className="text-2xl font-bold capitalize">
                    {subscriptionTier} {isSubscribed && '✓'}
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
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isSubscribed ? 'Next Billing' : 'Member Since'}
                  </p>
                  <p className="text-2xl font-bold">
                    {subscription?.subscription_end 
                      ? format(new Date(subscription.subscription_end), 'MMM dd')
                      : format(new Date(subscription?.created_at || Date.now()), 'MMM dd')
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Subscription Manager or Upgrade Options */}
          {isSubscribed ? (
            <SubscriptionManager />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Upgrade to Unlock Premium Features</AlertTitle>
              <AlertDescription>
                Get priority support, advanced analytics, faster approvals, and access to exclusive brands.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          {showUpgrade ? (
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
        </TabsContent>

        {/* Usage & Analytics Tab */}
        <TabsContent value="usage" className="space-y-6">
          <UsageIndicator 
            currentApplications={currentApplications}
            limit={currentLimit}
            subscriptionTier={subscriptionTier}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Application Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Applications</span>
                  <span className="text-2xl font-bold">{currentApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="text-xl font-semibold text-amber-600">{pendingApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Approved</span>
                  <span className="text-xl font-semibold text-green-600">{approvedApplications}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Communication Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Messages</span>
                  <span className="text-2xl font-bold">{messageCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Brands Contacted</span>
                  <span className="text-xl font-semibold">{currentApplications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="text-xl font-semibold text-green-600">
                    {currentApplications > 0 
                      ? Math.round((approvedApplications / currentApplications) * 100) 
                      : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {!isSubscribed && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unlock Advanced Analytics</AlertTitle>
              <AlertDescription>
                Upgrade to get detailed conversion tracking, response time analytics, and brand performance insights.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq">
          <FAQSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerSubscription;
