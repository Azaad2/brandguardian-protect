import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';

interface UseAuthActionsProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthActions = ({ setIsLoading }: UseAuthActionsProps) => {
  const navigate = useNavigate();

  const signUp = async (
    email: string, 
    password: string, 
    metadata: { 
      full_name: string;
      company_name: string;
      user_role: UserRole;
    }
  ) => {
    try {
      setIsLoading(true);
      console.log(`📝 Attempting to sign up user: ${email} with role: ${metadata.user_role}`);
      
      // For resellers, create account but keep it inactive until admin approval
      if (metadata.user_role === 'reseller') {
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: {
            data: {
              ...metadata,
              status: 'pending_approval' // Add status to metadata
            }
          }
        });
        
        if (error) {
          console.error('❌ Signup error:', error);
          throw error;
        }
        
        console.log('✅ Reseller signup successful, pending approval:', email);
        
        toast({
          title: 'Application submitted',
          description: 'Your reseller application has been submitted. You will receive an email notification once your account is approved by our admin team.',
        });
        
        // Don't redirect to dashboard, stay on signup page or redirect to home
        navigate('/');
        
      } else {
        // For brands and admins, normal signup flow
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password, 
          options: {
            data: metadata
          }
        });
        
        if (error) {
          console.error('❌ Signup error:', error);
          throw error;
        }
        
        console.log('✅ Signup successful for:', email);
        
        toast({
          title: 'Account created',
          description: 'Please check your email to confirm your registration.',
        });
        
        // Redirect based on user role
        navigate(`/${metadata.user_role}/login`);
      }
      
    } catch (error: any) {
      console.error('❌ Signup failed:', error);
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log(`🔐 Starting sign in process for: ${email}`);
      
      // First, verify credentials without signing in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔐 Sign in response:', { 
        user: data?.user?.id, 
        session: !!data?.session,
        error: error?.message 
      });
      
      if (error) {
        console.error('❌ Sign in error details:', {
          message: error.message,
          code: error.code || 'unknown',
          status: error.status || 'unknown'
        });
        throw error;
      }

      // Check if user is a reseller and if they're approved BEFORE allowing login
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', data.user.id)
          .single();

        if (profile?.user_role === 'reseller') {
          console.log('🔍 Checking reseller approval status for:', email);
          
          const { data: resellerApp, error: appError } = await supabase
            .from('reseller_applications')
            .select('status')
            .eq('user_id', data.user.id)
            .maybeSingle();

          console.log('📋 Reseller application check:', { 
            found: !!resellerApp, 
            status: resellerApp?.status,
            error: appError?.message 
          });

          // If no application found, create a pending one
          if (!resellerApp && !appError) {
            console.log('📝 No application found, creating pending application');
            
            const { error: createError } = await supabase
              .from('reseller_applications')
              .insert({
                user_id: data.user.id,
                email: data.user.email || email,
                company_name: profile?.user_role || 'Unknown Company',
                business_type: 'Unknown',
                ein_number: 'Not Provided',
                product_categories: ['General'],
                sales_volume: 'Unknown',
                wholesale_budget: 'Unknown',
                phone: 'Not Provided',
                status: 'pending'
              });

            if (createError) {
              console.error('❌ Error creating reseller application:', createError);
            } else {
              console.log('✅ Created pending reseller application');
            }

            // Sign out the user and show pending message
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            
            throw new Error('Your reseller account is pending approval. An application has been created for admin review. Please wait for admin approval before logging in.');
          }

          // If application exists but not approved
          if (resellerApp && resellerApp.status !== 'approved') {
            console.log('⏳ Reseller application status:', resellerApp.status);
            
            // Sign out the user immediately to prevent any navigation
            await supabase.auth.signOut();
            localStorage.clear();
            sessionStorage.clear();
            
            const statusMessage = resellerApp.status === 'rejected' 
              ? 'Your reseller application has been rejected. Please contact support for more information.'
              : 'Your reseller account is pending approval. Please wait for admin approval before logging in.';
            
            throw new Error(statusMessage);
          }

          console.log('✅ Reseller application approved, allowing login');
        }
      }
      
      console.log('✅ Sign in successful for:', email);
      
      // Don't navigate here - let the auth state change handle routing
      
    } catch (error: any) {
      console.error('❌ Sign in failed for:', email, error);
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message,
      });
      throw error; // Re-throw to allow the component to handle the error
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('🚪 Signing out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Sign out successful');
      navigate('/');
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      toast({
        variant: 'destructive',
        title: 'Error signing out',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      console.log(`🔄 Requesting password reset for: ${email}`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });
      
      if (error) {
        console.error('❌ Password reset error:', error);
        throw error;
      }
      
      console.log('✅ Password reset email sent to:', email);
      
      // Always show success message, even if email doesn't exist (security best practice)
      toast({
        title: 'Reset link sent',
        description: 'If an account exists with that email, you will receive a password reset link.',
        duration: 5000,
      });
      
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      
      // Handle specific error types
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        errorMessage = 'Too many password reset requests. Please wait before trying again.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
        description: errorMessage,
      });
      
      throw error; // Re-throw to let the component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, signIn, signOut, resetPassword };
};
