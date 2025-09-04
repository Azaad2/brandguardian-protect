
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { generateTemporaryPassword } from '@/hooks/reseller-applications/passwordUtils';

interface ResellerApplication {
  id: string;
  user_id: string;
  email: string;
  company_name: string;
  business_type: string;
  ein_number: string;
  phone: string;
  sales_volume: string;
  wholesale_budget: string;
  product_categories: string[];
  status: string;
  application_status: string;
  amazon_seller_id: string | null;
  walmart_seller_id: string | null;
  ebay_seller_id: string | null;
  feedback_score: string | null;
  linkedin: string | null;
  document_path: string | null;
  document_verified: boolean;
  document_verification_notes: string | null;
  document_verified_at: string | null;
  document_verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useResellerApproval = () => {
  const [applications, setApplications] = useState<ResellerApplication[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('admin_get_reseller_applications');

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch reseller applications',
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyDocument = async (applicationId: string, verified: boolean, notes?: string) => {
    try {
      const { data, error } = await supabase.rpc('admin_verify_document', {
        application_id: applicationId,
        verified,
        notes
      });

      if (error) throw error;

      toast({
        title: verified ? 'Document verified' : 'Document rejected',
        description: verified ? 'Document has been verified successfully' : 'Document verification was rejected',
      });

      // Refresh applications list
      await fetchAllApplications();
      return true;
    } catch (error) {
      console.error('Error verifying document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to verify document. Please try again.',
      });
      return false;
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
      await fetchAllApplications();
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
      await fetchAllApplications();
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
    fetchAllApplications();
  }, []);

  return {
    applications,
    loading,
    approveApplication,
    rejectApplication,
    verifyDocument,
    refreshApplications: fetchAllApplications
  };
};
