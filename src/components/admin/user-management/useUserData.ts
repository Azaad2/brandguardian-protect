import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, ResellerApplication } from './types';

export const useUserData = () => {
  // Fetch all users using the RPC function
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();

      if (profile?.user_role !== 'admin') {
        throw new Error('Not authorized - admin access required');
      }

      const { data, error } = await supabase.rpc('admin_get_all_users');
      
      if (error) {
        throw error;
      }

      return data as UserProfile[];
    },
  });

  // Fetch detailed user information
  const fetchUserDetails = async (userId: string, userRole: string): Promise<ResellerApplication | null> => {
    if (userRole === 'reseller') {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        return null;
      }
      return data;
    }
    return null;
  };

  return {
    users,
    isLoading,
    refetch,
    fetchUserDetails,
  };
};