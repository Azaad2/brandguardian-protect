
import { supabase } from '@/integrations/supabase/client';
import { ResellerApplication } from './types';

export const fetchApplicationsApi = async (): Promise<ResellerApplication[]> => {
  console.log('Fetching reseller applications...');
  
  const { data, error } = await supabase
    .from('reseller_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    throw error;
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
  const { error } = await supabase
    .from('reseller_applications')
    .update({
      user_id: userId,
      status: 'approved',
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId);
    
  if (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};

export const addManualApplicationApi = async (email: string, companyName: string) => {
  console.log('Adding manual application:', { email, companyName });
  
  const { data, error } = await supabase
    .from('reseller_applications')
    .insert({
      email: email,
      company_name: companyName,
      business_type: 'manual',
      ein_number: 'manual-entry',
      product_categories: ['other'],
      sales_volume: 'under_10k',
      wholesale_budget: 'under_5k',
      phone: 'manual-entry',
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding application:', error);
    throw error;
  }

  console.log('Added manual application:', data);
  return data;
};
