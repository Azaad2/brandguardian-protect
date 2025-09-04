import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ProfileForm from "./settings/ProfileForm";
import NotificationForm from "./settings/NotificationForm";
import SecuritySettings from "./settings/SecuritySettings";
import { useProfileData } from "./settings/useProfileData";
import { useBrandSubscription } from "@/hooks/use-brand-data";

const BrandSettings = () => {
  const { profile, isLoading } = useProfileData();
  const { data: subscription, isLoading: subscriptionLoading } = useBrandSubscription();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm profile={profile} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent>
              {subscriptionLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-[300px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              ) : subscription ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Plan</label>
                      <p className="text-lg font-semibold capitalize">
                        {subscription.subscription_tier || 'Free'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Brand Application Limit</label>
                      <p className="text-lg font-semibold">
                        {subscription.brand_application_limit?.toLocaleString() || 'Unlimited'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <p className={`text-lg font-semibold ${subscription.subscribed ? 'text-green-600' : 'text-gray-600'}`}>
                        {subscription.subscribed ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    {subscription.subscription_end && (
                      <div>
                        <label className="text-sm font-medium">Expires</label>
                        <p className="text-lg">
                          {new Date(subscription.subscription_end).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No subscription information found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationForm />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandSettings;