
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useUserActions = () => {
  const handleSuspendUser = async (userId: string, userEmail: string) => {
    try {
      console.log(`Suspending user: ${userId}`);
      
      const { data, error } = await supabase.rpc('admin_suspend_user', {
        target_user_id: userId
      });

      if (error) {
        console.error('Error suspending user:', error);
        throw error;
      }

      if (data) {
        toast({
          title: 'User suspended',
          description: `${userEmail} has been suspended successfully.`,
        });
        return true;
      } else {
        throw new Error('Failed to suspend user - operation not allowed');
      }
    } catch (error: any) {
      console.error('Failed to suspend user:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to suspend user',
        description: error.message || 'An error occurred while suspending the user.',
      });
      return false;
    }
  };

  const handleActivateUser = async (userId: string, userEmail: string) => {
    try {
      console.log(`Activating user: ${userId}`);
      
      const { data, error } = await supabase.rpc('admin_activate_user', {
        target_user_id: userId
      });

      if (error) {
        console.error('Error activating user:', error);
        throw error;
      }

      if (data) {
        toast({
          title: 'User activated',
          description: `${userEmail} has been activated successfully.`,
        });
        return true;
      } else {
        throw new Error('Failed to activate user - operation not allowed');
      }
    } catch (error: any) {
      console.error('Failed to activate user:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to activate user',
        description: error.message || 'An error occurred while activating the user.',
      });
      return false;
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      console.log(`Deleting user: ${userId}`);
      
      const { data, error } = await supabase.rpc('admin_soft_delete_user', {
        target_user_id: userId
      });

      if (error) {
        console.error('Error deleting user:', error);
        throw error;
      }

      if (data) {
        toast({
          title: 'User deleted',
          description: `${userEmail} has been deleted successfully.`,
        });
        return true;
      } else {
        throw new Error('Failed to delete user - operation not allowed');
      }
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to delete user',
        description: error.message || 'An error occurred while deleting the user.',
      });
      return false;
    }
  };

  return {
    handleSuspendUser,
    handleActivateUser,
    handleDeleteUser,
  };
};
