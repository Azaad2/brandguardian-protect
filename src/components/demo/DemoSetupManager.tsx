import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { createDemoAccounts, DEMO_ACCOUNTS, type DemoAccount } from '@/utils/demo-setup';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Users, Building, Shield, RefreshCw } from 'lucide-react';

const DemoSetupManager = () => {
  const [isCreatingDemo, setIsCreatingDemo] = useState(false);
  const [isReseeding, setIsReseeding] = useState(false);
  const [demoCreated, setDemoCreated] = useState(false);
  const [verificationData, setVerificationData] = useState<any>(null);

  const handleCreateDemo = async () => {
    setIsCreatingDemo(true);
    
    try {
      // First create demo accounts
      const result = await createDemoAccounts();
      
      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Demo Account Creation Failed",
          description: "Some demo accounts could not be created. Check console for details.",
        });
        return;
      }

      // Then seed demo data using the edge function
      await seedDemoData();
      
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

  const seedDemoData = async () => {
    try {
      console.log('Calling seed-demo-data edge function...');
      
      const { data: seedResult, error } = await supabase.functions.invoke('seed-demo-data', {
        body: {}
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }
      
      if (seedResult.success) {
        setDemoCreated(true);
        await verifyDemoData();
        toast({
          title: "Demo Setup Complete! 🎉",
          description: "All demo accounts and sample data have been created successfully.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Demo Data Seeding Failed",
          description: seedResult.error || "Unknown error occurred",
        });
      }
    } catch (error) {
      console.error('Seeding error:', error);
      toast({
        variant: "destructive",
        title: "Demo Data Seeding Failed",
        description: error.message || "Failed to seed demo data",
      });
    }
  };

  const handleReseedData = async () => {
    setIsReseeding(true);
    try {
      await seedDemoData();
    } finally {
      setIsReseeding(false);
    }
  };

  const verifyDemoData = async () => {
    try {
      // Check brands
      const { count: brandsCount } = await supabase
        .from('brands_directory')
        .select('id', { count: 'exact' })
        .ilike('name', '[DEMO]%');

      // Check allocations
      const { count: allocationsCount } = await supabase
        .from('brand_reseller_allocations')
        .select('id', { count: 'exact' })
        .eq('reseller_id', (await supabase.from('profiles').select('id').eq('email', 'demo.reseller@bndbox.com').single()).data?.id);

      // Check products
      const { count: productsCount } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .ilike('name', '[DEMO]%');

      // Check orders
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .eq('reseller_id', (await supabase.from('profiles').select('id').eq('email', 'demo.reseller@bndbox.com').single()).data?.id);

      setVerificationData({
        brands: brandsCount || 0,
        allocations: allocationsCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0
      });
    } catch (error) {
      console.error('Verification error:', error);
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
              
              {verificationData && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Verification Results:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                    <div>✅ {verificationData.brands} Demo Brands</div>
                    <div>✅ {verificationData.allocations} Brand Allocations</div>
                    <div>✅ {verificationData.products} Demo Products</div>
                    <div>✅ {verificationData.orders} Demo Orders</div>
                  </div>
                </div>
              )}
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 text-sm">
                  All demo accounts and sample data have been created. You can now share the credentials below with your investor.
                </p>
              </div>

              <Button 
                onClick={handleReseedData}
                disabled={isReseeding}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isReseeding ? 'animate-spin' : ''}`} />
                {isReseeding ? "Re-seeding Data..." : "Force Re-seed Demo Data"}
              </Button>
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