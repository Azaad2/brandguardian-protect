
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { updateUserRole, getCurrentUserRole } from '@/utils/update-user-role';
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
      await updateUserRole(user.id, 'admin');
      toast({
        title: 'Success',
        description: 'Your role has been updated to admin. Please refresh the page.',
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
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Check and update your user role to access admin features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentRole && (
          <div className="p-3 bg-slate-100 rounded-md">
            <p className="text-sm">Current Role: <strong>{currentRole}</strong></p>
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
            {isLoading ? 'Updating...' : 'Update to Admin Role'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminRoleUpdater;
