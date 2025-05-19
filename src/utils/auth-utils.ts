
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

/**
 * Fetch user role from the profiles table
 */
export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  if (!userId) {
    console.log('No user ID provided to fetchUserRole');
    return null;
  }
  
  try {
    console.log(`Fetching role for user: ${userId}`);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .maybeSingle(); // Using maybeSingle instead of single for more graceful error handling
      
    if (error) {
      console.error('Error fetching user role:', error.message, error.details);
      return null;
    }
    
    if (!data) {
      console.log(`No profile found for user: ${userId}`);
      return null;
    }
    
    console.log('User role fetched successfully:', data.user_role);
    return data.user_role as UserRole || null;
  } catch (error) {
    console.error('Unexpected error fetching user role:', error);
    return null;
  }
};

/**
 * Create a test user for demonstration purposes
 */
export const createTestUser = async (email: string, password: string, userRole: UserRole): Promise<boolean> => {
  try {
    // Generate a more compatible test email address
    const cleanEmail = email.replace(/_/g, '') // Remove underscores as they may cause issues

    // First, sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({ 
      email: cleanEmail, 
      password, 
      options: {
        data: {
          full_name: userRole === 'reseller' ? 'Test Reseller' : 'Test Brand',
          company_name: userRole === 'reseller' ? 'Demo Reseller Company' : 'Demo Brand Company',
          user_role: userRole
        }
      }
    });
    
    if (signUpError) {
      console.error('Error creating test user:', signUpError);
      return false;
    }
    
    // Log success details to help with troubleshooting
    console.log('Test user created successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in createTestUser:', error);
    return false;
  }
};
