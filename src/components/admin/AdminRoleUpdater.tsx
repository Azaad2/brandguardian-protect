
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { updateUserRole, getCurrentUserRole, makeCurrentUserAdmin } from '@/utils/update-user-role';
import { useAuth } from '@/hooks/use-auth';

const AdminRoleUpdater = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const { user } = useAuth();

  const handleCheckRole = async () => {
    try {
      setIsLoading(true);
      const roleData = await getCurrentUserRole();
      setCurrentRole(roleData.user_role);
      toast({
        title: 'Current Role',
        description: `Your current role is: ${roleData.user_role}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to check role: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateToAdmin = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'No user found',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      await makeCurrentUserAdmin();
      toast({
        title: 'Success! 🎉',
        description: 'You are now an admin and can access all portals! Please refresh the page.',
      });
      
      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to update role: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>BndBox Owner Access</CardTitle>
        <CardDescription>
          Become an admin to access all portals (Brand, Reseller, and Admin)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentRole && (
          <div className="p-3 bg-slate-100 rounded-md">
            <p className="text-sm">Current Role: <strong>{currentRole}</strong></p>
            {currentRole === 'admin' && (
              <p className="text-sm text-green-600 mt-1">✅ You can access all portals!</p>
            )}
          </div>
        )}
        
        <div className="space-y-2">
          <Button 
            onClick={handleCheckRole} 
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? 'Checking...' : 'Check Current Role'}
          </Button>
          
          <Button 
            onClick={handleUpdateToAdmin} 
            disabled={isLoading || currentRole === 'admin'}
            className="w-full"
          >
            {isLoading ? 'Updating...' : 'Make Me Admin (Owner Access)'}
          </Button>
        </div>

        {currentRole === 'admin' && (
          <div className="text-center space-y-2">
            <p className="text-sm text-green-600 font-medium">🎉 Admin Access Granted!</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p>You can now access:</p>
              <p>• <a href="/admin/dashboard" className="text-blue-600 hover:underline">Admin Portal</a></p>
              <p>• <a href="/brand/dashboard" className="text-blue-600 hover:underline">Brand Portal</a></p>
              <p>• <a href="/reseller/dashboard" className="text-blue-600 hover:underline">Reseller Portal</a></p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminRoleUpdater;
