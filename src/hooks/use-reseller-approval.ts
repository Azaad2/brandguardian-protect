
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

      // Get the application to check if user exists
      const { data: application, error: appError } = await supabase
        .from('reseller_applications')
        .select('user_id')
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;

      // If no user_id exists, create the user account first
      if (!application.user_id) {
        console.log('👤 No user account found, creating account for:', userEmail);
        
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: userEmail,
          password: temporaryPassword,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            user_role: 'reseller'
          }
        });

        if (createError) {
          console.error('❌ Error creating user account:', createError);
          throw createError;
        }

        console.log('✅ User account created successfully:', newUser.user?.id);

        // Update application with new user_id
        const { error: updateUserIdError } = await supabase
          .from('reseller_applications')
          .update({ user_id: newUser.user?.id })
          .eq('id', applicationId);

        if (updateUserIdError) {
          console.error('❌ Error updating application with user_id:', updateUserIdError);
          throw updateUserIdError;
        }
      } else {
        console.log('👤 User account exists, updating password for:', userEmail);
        
        // Update existing user's password
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          application.user_id,
          { password: temporaryPassword }
        );

        if (passwordError) {
          console.error('❌ Error updating user password:', passwordError);
          throw passwordError;
        }

        console.log('✅ User password updated successfully');
      }

      // Update application status to approved
      const { error: updateError } = await supabase
        .from('reseller_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      console.log('✅ Application status updated to approved');

      // Send approval email with temporary password via edge function
      const { error: emailError } = await supabase.functions.invoke('send-reseller-approval-email', {
        body: {
          email: userEmail,
          status: 'approved',
          loginUrl: `${window.location.origin}/reseller/login`,
          temporaryPassword: temporaryPassword
        }
      });

      if (emailError) {
        console.error('❌ Error sending approval email:', emailError);
        // Don't throw here, application is still approved
      } else {
        console.log('✅ Approval email sent successfully');
      }

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
