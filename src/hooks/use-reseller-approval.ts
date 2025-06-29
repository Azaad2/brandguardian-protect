
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateTemporaryPassword } from '@/hooks/reseller-applications/passwordUtils';

interface ResellerApplication {
  id: string;
  user_id: string;
  email: string;
  company_name: string;
  status: string;
  created_at: string;
}

export const useResellerApproval = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select(`
          id,
          user_id,
          email,
          company_name,
          status,
          created_at
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch pending applications',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveApplication = async (applicationId: string, userEmail: string) => {
    try {
      console.log('🎯 Starting approval process for:', userEmail);
      
      // Generate temporary password
      const temporaryPassword = generateTemporaryPassword();
      console.log('🔐 Generated temporary password for:', userEmail);

      // Call the edge function to handle the approval
      const { data, error } = await supabase.functions.invoke('approve-reseller-application', {
        body: {
          applicationId,
          userEmail,
          action: 'approve',
          temporaryPassword
        }
      });

      if (error) {
        console.error('❌ Error from approval function:', error);
        throw error;
      }

      console.log('✅ Application approved successfully:', data);

      toast({
        title: 'Application approved',
        description: 'Reseller has been notified via email with login credentials and can now login.',
      });

      // Refresh applications list
      await fetchPendingApplications();
    } catch (error) {
      console.error('❌ Error approving application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve application. Please try again.',
      });
    }
  };

  const rejectApplication = async (applicationId: string, userEmail: string) => {
    try {
      console.log('🎯 Starting rejection process for:', userEmail);

      // Call the edge function to handle the rejection
      const { data, error } = await supabase.functions.invoke('approve-reseller-application', {
        body: {
          applicationId,
          userEmail,
          action: 'reject'
        }
      });

      if (error) {
        console.error('❌ Error from rejection function:', error);
        throw error;
      }

      console.log('✅ Application rejected successfully:', data);

      toast({
        title: 'Application rejected',
        description: 'Reseller has been notified via email.',
      });

      // Refresh applications list
      await fetchPendingApplications();
    } catch (error) {
      console.error('❌ Error rejecting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject application. Please try again.',
      });
    }
  };

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  return {
    applications,
    loading,
    approveApplication,
    rejectApplication,
    refreshApplications: fetchPendingApplications
  };
};
