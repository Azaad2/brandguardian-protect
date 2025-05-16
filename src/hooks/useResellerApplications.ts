
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ResellerApplication {
  id: string;
  email: string;
  company_name: string;
  created_at: string;
  status: string;
  user_id: string | null;
}

export const useResellerApplications = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState<Record<string, boolean>>({});
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  const generateTemporaryPassword = () => {
    // Generate a random password that meets requirements
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const fetchResellerApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Initialize temporary passwords for each application
      const initialPasswords: Record<string, string> = {};
      data?.forEach(app => {
        initialPasswords[app.id] = generateTemporaryPassword();
      });

      setApplications(data || []);
      setPasswords(initialPasswords);
      
      // Debug log
      console.log('Fetched applications:', data);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: 'Error fetching reseller applications',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePasswordChange = (id: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const createAccount = async (application: ResellerApplication) => {
    if (!passwords[application.id] || passwords[application.id].length < 8) {
      toast({
        title: 'Invalid password',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreatingAccount((prev) => ({ ...prev, [application.id]: true }));
      console.log('Creating account for:', application.email, 'with password length:', passwords[application.id].length);

      // First check if a user with this email already exists
      const { data: existingUsers, error: existingError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', application.email)
        .maybeSingle();

      if (existingError) {
        console.error('Error checking existing users:', existingError);
        throw existingError;
      }

      if (existingUsers) {
        console.log('User already exists:', existingUsers);
        toast({
          title: 'User already exists',
          description: `A user with email ${application.email} already exists in the system.`,
          variant: 'destructive',
        });
        return;
      }

      // Create the user account
      const { data, error } = await supabase.auth.signUp({
        email: application.email,
        password: passwords[application.id],
        options: {
          data: {
            full_name: application.company_name, // Using company name as full name
            company_name: application.company_name,
            user_role: 'reseller'
          }
        }
      });

      if (error) {
        console.error('Error creating user account:', error);
        throw error;
      }

      console.log('Created user account:', data);

      // Update the application to link it to the user
      const { error: updateError } = await supabase
        .from('reseller_applications')
        .update({ 
          user_id: data.user?.id,
          status: 'approved' 
        })
        .eq('id', application.id);
        
      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      toast({
        title: 'Account created successfully',
        description: `Reseller account for ${application.email} has been created.`,
      });

      // Refresh the list
      fetchResellerApplications();

    } catch (error: any) {
      console.error('Error in createAccount:', error);
      toast({
        title: 'Error creating account',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreatingAccount((prev) => ({ ...prev, [application.id]: false }));
    }
  };

  const addManualApplication = async (email: string, companyName: string) => {
    if (!email || !companyName) {
      toast({
        title: 'Missing information',
        description: 'Please provide both email and company name',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Adding manual application:', { email, companyName });
      
      // Insert the application into the database
      const { data, error } = await supabase
        .from('reseller_applications')
        .insert([
          { 
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
        ])
        .select();

      if (error) {
        console.error('Supabase error adding application:', error);
        throw error;
      }

      console.log('Added manual application:', data);

      toast({
        title: 'Application added successfully',
        description: 'The reseller application has been added to the system.',
      });

      // Refresh the list
      fetchResellerApplications();

    } catch (error: any) {
      console.error('Error in addManualApplication:', error);
      toast({
        title: 'Error adding application',
        description: error.message || "Failed to connect to the database. Please try again.",
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchResellerApplications();
  }, []);

  return {
    applications,
    loading,
    refreshing,
    creatingAccount,
    passwords,
    fetchResellerApplications,
    handlePasswordChange,
    createAccount,
    addManualApplication,
    setRefreshing
  };
};
