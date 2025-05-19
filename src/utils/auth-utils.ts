
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

/**
 * Fetch user role from the profiles table
 */
export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data?.user_role as UserRole || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};
