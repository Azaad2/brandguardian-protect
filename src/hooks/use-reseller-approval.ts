
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
      // Update application status
      const { error: updateError } = await supabase
        .from('reseller_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Send approval email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-reseller-approval-email', {
        body: {
          email: userEmail,
          status: 'approved',
          loginUrl: `${window.location.origin}/reseller/login`
        }
      });

      if (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't throw here, application is still approved
      }

      toast({
        title: 'Application approved',
        description: 'Reseller has been notified via email and can now login.',
      });

      // Refresh applications list
      await fetchPendingApplications();
    } catch (error) {
      console.error('Error approving application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to approve application',
      });
    }
  };

  const rejectApplication = async (applicationId: string, userEmail: string) => {
    try {
      // Update application status
      const { error: updateError } = await supabase
        .from('reseller_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      // Send rejection email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-reseller-approval-email', {
        body: {
          email: userEmail,
          status: 'rejected',
          loginUrl: null
        }
      });

      if (emailError) {
        console.error('Error sending rejection email:', emailError);
      }

      toast({
        title: 'Application rejected',
        description: 'Reseller has been notified via email.',
      });

      // Refresh applications list
      await fetchPendingApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to reject application',
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
