
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
      .select('user_role, full_name, company_name')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching user role:', error.message, error.details);
      return null;
    }
    
    if (!data) {
      console.log(`No profile found for user: ${userId}`);
      
      try {
        // Get current user data from session
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const metadata = userData.user.user_metadata;
          const userEmail = userData.user.email;
          
          if (userEmail) {
            console.log('Attempting to create profile from metadata:', metadata);
            
            // Set a default user role if none exists in metadata
            const userRole = metadata?.user_role || 'reseller';
            const fullName = metadata?.full_name || userEmail.split('@')[0];
            const companyName = metadata?.company_name || `${fullName}'s Company`;
            
            // Create profile if missing using RPC function to bypass RLS
            const { error: insertError } = await supabase.rpc(
              'create_user_profile' as any, 
              {
                user_id: userId,
                user_email: userEmail,
                user_full_name: fullName,
                user_company_name: companyName,
                user_role: userRole
              }
            );
              
            if (insertError) {
              console.error('Error creating missing profile via RPC:', insertError);
              // Try to return the role from metadata as fallback
              return metadata?.user_role as UserRole || null;
            } else {
              console.log('Created missing profile for user via RPC:', userId);
              return userRole as UserRole;
            }
          }
        }
      } catch (authError) {
        console.error('Error retrieving auth user data:', authError);
        // Try to extract role directly from session as last resort
        try {
          const { data: session } = await supabase.auth.getSession();
          if (session?.session?.user?.user_metadata?.user_role) {
            return session.session.user.user_metadata.user_role as UserRole;
          }
        } catch (sessionError) {
          console.error('Error extracting role from session:', sessionError);
        }
      }
      
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
