
import { supabase } from '@/integrations/supabase/client';
import { ResellerApplication } from './types';

export const fetchApplicationsApi = async (): Promise<ResellerApplication[]> => {
  console.log('Fetching reseller applications...');
  
  // Use the admin RPC function for better access control
  const { data, error } = await supabase.rpc('admin_get_reseller_applications' as any);

  if (error) {
    console.error('RPC error fetching applications:', error);
    // Fallback to direct query
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('reseller_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw fallbackError;
    }
    
    return fallbackData || [];
  }
  
  console.log('Fetched applications:', data);
  return data || [];
};

export const createUserAccountApi = async (email: string, password: string, companyName: string) => {
  // First check if a user with this email already exists
  const { data: existingUsers, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking existing users:', existingError);
    throw existingError;
  }

  if (existingUsers) {
    throw new Error(`A user with email ${email} already exists in the system.`);
  }

  // Create the user account
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        full_name: companyName,
        company_name: companyName,
        user_role: 'reseller'
      }
    }
  });

  if (error) {
    console.error('Error creating user account:', error);
    throw error;
  }

  return data;
};

export const updateApplicationApi = async (applicationId: string, userId: string) => {
  const { error } = await supabase.rpc('admin_update_reseller_application' as any, {
    application_id: applicationId,
    application_data: {
      user_id: userId,
      status: 'approved'
    }
  });
    
  if (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

export const addManualApplicationApi = async (email: string, companyName: string) => {
  const { data, error } = await supabase.rpc('admin_add_reseller_application' as any, {
    application_data: {
      email: email,
      company_name: companyName,
      business_type: 'manual',
      ein_number: 'manual-entry',
      product_categories: ['other'],
      sales_volume: 'under_10k',
      wholesale_budget: 'under_5k',
      phone: 'manual-entry',
      status: 'pending'
    }
  });

  if (error) {
    console.error('RPC error adding application:', error);
    throw error;
  }

  console.log('Added manual application:', data);
  return data;
};
