
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SecuritySettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Change Password</h3>
            <p className="text-sm text-muted-foreground">
              Change your account password
            </p>
            <Button variant="outline">Change Password</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Login History</h3>
            <p className="text-sm text-muted-foreground">
              View your recent login activity
            </p>
            <Button variant="outline">View Login History</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
