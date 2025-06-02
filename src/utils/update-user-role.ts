
import { supabase } from '@/integrations/supabase/client';

export const updateUserRole = async (userId: string, newRole: 'admin' | 'brand' | 'reseller') => {
  try {
    console.log(`Updating user ${userId} to role: ${newRole}`);
    
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, user_role')
      .eq('id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }
    
    if (!existingProfile) {
      throw new Error('No profile found for this user');
    }
    
    // Now update the role
    const { data, error } = await supabase
      .from('profiles')
      .update({ user_role: newRole })
      .eq('id', userId)
      .select('id, user_role, full_name')
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
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No profile found for current user');
    }
    
    console.log('Current user role:', data);
    return data;
  } catch (error) {
    console.error('Failed to get current user role:', error);
    throw error;
  }
};

export const makeCurrentUserAdmin = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('No authenticated user found');
    }
    
    return await updateUserRole(user.id, 'admin');
  } catch (error) {
    console.error('Failed to make current user admin:', error);
    throw error;
  }
};

export const createAdminProfile = async (email: string, fullName: string, companyName: string) => {
  try {
    console.log(`Creating admin profile for email: ${email}`);
    
    // Check if a profile already exists with this email
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id, user_role, email')
      .eq('email', email)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }
    
    if (existingProfile) {
      // If profile exists, update it to admin role
      const { data, error } = await supabase
        .from('profiles')
        .update({ user_role: 'admin' })
        .eq('id', existingProfile.id)
        .select('id, user_role, full_name, email')
        .single();
      
      if (error) {
        console.error('Error updating existing profile to admin:', error);
        throw error;
      }
      
      console.log('Updated existing profile to admin:', data);
      return data;
    }
    
    // If no profile exists, we need to create a user first
    // Note: In a real scenario, the user would need to sign up first
    throw new Error('No user account found with this email. The user must sign up first before becoming an admin.');
  } catch (error) {
    console.error('Failed to create admin profile:', error);
    throw error;
  }
};

export const updateProfileToAdmin = async (email: string) => {
  try {
    console.log(`Updating profile to admin for email: ${email}`);
    
    // Find the profile by email
    const { data: profile, error: findError } = await supabase
      .from('profiles')
      .select('id, user_role, email, full_name')
      .eq('email', email)
      .maybeSingle();
    
    if (findError) {
      console.error('Error finding profile:', findError);
      throw findError;
    }
    
    if (!profile) {
      throw new Error('No profile found with this email address');
    }
    
    // Update the role to admin
    const { data, error } = await supabase
      .from('profiles')
      .update({ user_role: 'admin' })
      .eq('id', profile.id)
      .select('id, user_role, full_name, email')
      .single();
    
    if (error) {
      console.error('Error updating profile to admin:', error);
      throw error;
    }
    
    console.log('Profile updated to admin successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to update profile to admin:', error);
    throw error;
  }
};
