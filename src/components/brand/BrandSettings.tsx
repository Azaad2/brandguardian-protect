
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from "./settings/ProfileForm";
import NotificationForm from "./settings/NotificationForm";
import SecuritySettings from "./settings/SecuritySettings";
import { useProfileData } from "./settings/useProfileData";

const BrandSettings = () => {
  const { profile, isLoading } = useProfileData();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          <ProfileForm profile={profile} isLoading={isLoading} />
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
