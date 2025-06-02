
import { supabase } from '@/integrations/supabase/client';

export const updateUserRole = async (userId: string, newRole: 'admin' | 'brand' | 'reseller') => {
  try {
    console.log(`Updating user ${userId} to role: ${newRole}`);
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ user_role: newRole })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
    
    console.log('User role updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update user role:', error);
    throw error;
  }
};

export const getCurrentUserRole = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('No authenticated user found');
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_role, full_name')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
    
    console.log('Current user role:', data);
    return data;
  } catch (error) {
    console.error('Failed to get current user role:', error);
    throw error;
  }
};
