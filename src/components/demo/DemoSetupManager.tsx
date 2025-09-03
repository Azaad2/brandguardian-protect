import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { setupCompleteDemo, DEMO_ACCOUNTS, type DemoAccount } from '@/utils/demo-setup';
import { CheckCircle, AlertCircle, Users, Building, Shield } from 'lucide-react';

const DemoSetupManager = () => {
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [demoCreated, setDemoCreated] = useState(false);

  const handleCreateDemo = async () => {
    setIsCreatingDemo(true);
    
    try {
      // First create demo accounts
      const result = await setupCompleteDemo();
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Demo Setup Failed",
          description: result.message,
        });
        return;
      }

      // Then seed demo data using the edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seed-demo-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const seedResult = await response.json();
      
      if (seedResult.success) {
        setDemoCreated(true);
        toast({
          title: "Demo Setup Complete! 🎉",
          description: "All demo accounts and sample data have been created successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Demo Data Seeding Failed",
          description: seedResult.error,
        });
      }
    } catch (error) {
      console.error('Demo setup error:', error);
      toast({
        variant: "destructive",
        title: "Demo Setup Error",
        description: "An unexpected error occurred during demo setup.",
      });
    } finally {
      setIsCreatingDemo(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'reseller':
        return <Users className="h-4 w-4" />;
      case 'brand':
        return <Building className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'reseller':
        return 'bg-blue-100 text-blue-800';
      case 'brand':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Demo Setup Manager
          </CardTitle>
          <CardDescription>
            Create clean demo accounts and sample data for investor presentations without affecting real users.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!demoCreated ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">What this will create:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 3 clean demo accounts (Admin, Reseller, Brand)</li>
                  <li>• 5 sample brands with complete profiles and categories</li>
                  <li>• Brand-reseller allocations for seamless testing</li>
                  <li>• 5+ sample products with pricing and inventory data</li>
                  <li>• Sample orders and order history for analytics</li>
                  <li>• Brand applications in various approval stages</li>
                  <li>• Product upload records and catalog management data</li>
                  <li>• All data clearly marked as [DEMO] to avoid confusion</li>
                </ul>
              </div>
              
              <Button 
                onClick={handleCreateDemo}
                disabled={isCreatingDemo}
                className="w-full"
              >
                {isCreatingDemo ? "Creating Demo Setup..." : "Create Complete Demo Setup"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Demo setup completed successfully!</span>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  All demo accounts and sample data have been created. You can now share the credentials below with your investor.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo Account Credentials</CardTitle>
          <CardDescription>
            Share these credentials with your investor for the demonstration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {DEMO_ACCOUNTS.map((account) => (
              <div key={account.email} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(account.role)}
                    <span className="font-medium">{account.role.charAt(0).toUpperCase() + account.role.slice(1)} Portal</span>
                  </div>
                  <Badge className={getRoleColor(account.role)}>
                    {account.role}
                  </Badge>
                </div>
                
                <div className="bg-gray-50 p-3 rounded font-mono text-sm space-y-1">
                  <div><span className="font-bold">Email:</span> {account.email}</div>
                  <div><span className="font-bold">Password:</span> {account.password}</div>
                  <div><span className="font-bold">URL:</span> https://bndbox.com/{account.role}/dashboard</div>
                </div>
                
                <p className="text-xs text-gray-600 mt-2">{account.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• All demo data is clearly marked with [DEMO] prefix</li>
                  <li>• Demo accounts don't interfere with real user workflows</li>
                  <li>• Start with Admin portal to show complete platform overview</li>
                  <li>• Each role demonstrates different platform capabilities</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoSetupManager;