
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ResellerSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResellerSettings;
