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
      
      // Attempt to sign in with credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('🔐 Sign in response details:', { 
        userExists: !!data?.user,
        userId: data?.user?.id, 
        userEmail: data?.user?.email,
        sessionExists: !!data?.session,
        errorMessage: error?.message,
        errorCode: error?.code || 'none'
      });
      
      if (error) {
        console.error('❌ Sign in error:', {
          message: error.message,
          code: error.code || 'unknown',
          email: email,
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }

      // If we get here, authentication was successful
      console.log('✅ Authentication successful, checking user profile and permissions');

      // Check if user is a reseller and verify approval status
      if (data?.user) {
        console.log('👤 User authenticated, checking profile and role...');
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('user_role, full_name')
          .eq('id', data.user.id)
          .single();

        console.log('📋 Profile check result:', { 
          profileFound: !!profile, 
          userRole: profile?.user_role,
          profileError: profileError?.message 
        });

        if (profile?.user_role === 'reseller') {
          console.log('🔍 Reseller detected, checking approval status...');
          
          const { data: resellerApp, error: appError } = await supabase
            .from('reseller_applications')
            .select('status, updated_at')
            .eq('user_id', data.user.id)
            .single();

          console.log('📋 Reseller application status check:', { 
            applicationFound: !!resellerApp, 
            status: resellerApp?.status,
            checkError: appError?.message 
          });

          // If application exists and is not approved, block login
          if (resellerApp && resellerApp.status !== 'approved') {
            console.log('⛔ Blocking login - reseller application not approved');
            
            // Sign out the user immediately
            await supabase.auth.signOut();
            
            const statusMessage = resellerApp.status === 'rejected' 
              ? 'Your reseller application has been rejected. Please contact support for more information.'
              : 'Your reseller account is pending approval. Please wait for admin approval before logging in.';
            
            throw new Error(statusMessage);
          }

          // If no application found, check if this is a legacy reseller account
          if (!resellerApp && appError) {
            console.log('⚠️ No reseller application found - might be legacy account, allowing login');
          }

          console.log('✅ Reseller login approved');
        }
      }
      
      console.log('🎉 Sign in process completed successfully for:', email);
      
    } catch (error: any) {
      console.error('❌ Sign in process failed for:', email, {
        errorMessage: error?.message,
        errorCode: error?.code
      });
      
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message,
      });
      throw error;
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
      
      // Add retry logic with exponential backoff
      let attempts = 0;
      const maxAttempts = 3;
      let lastError;

      while (attempts < maxAttempts) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password/confirm`,
          });
          
          if (!error) {
            console.log('✅ Password reset email sent to:', email);
            
            toast({
              title: 'Reset link sent',
              description: 'If an account exists with that email, you will receive a password reset link shortly.',
              duration: 5000,
            });
            
            return; // Success, exit the function
          }
          
          lastError = error;
          
          // If it's a rate limit error, don't retry
          if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
            throw error;
          }
          
          // If it's a 504 timeout, retry with delay
          if (error.status === 504 || error.message?.includes('timeout')) {
            attempts++;
            if (attempts < maxAttempts) {
              console.log(`⏳ Timeout on attempt ${attempts}, retrying in ${attempts * 2} seconds...`);
              await new Promise(resolve => setTimeout(resolve, attempts * 2000));
              continue;
            }
          }
          
          throw error;
          
        } catch (retryError: any) {
          lastError = retryError;
          attempts++;
          
          if (attempts < maxAttempts && (retryError.status === 504 || retryError.message?.includes('timeout'))) {
            console.log(`⏳ Network error on attempt ${attempts}, retrying in ${attempts * 2} seconds...`);
            await new Promise(resolve => setTimeout(resolve, attempts * 2000));
          } else {
            break;
          }
        }
      }
      
      throw lastError;
      
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      
      // Handle specific error types with user-friendly messages
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        errorMessage = 'Too many password reset requests. Please wait a few minutes before trying again.';
      } else if (error.status === 504 || error.message?.includes('timeout') || error.message?.includes('deadline')) {
        errorMessage = 'The request timed out. This might be a temporary issue with our email service. Please try again in a few minutes.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, signIn, signOut, resetPassword };
};
