
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
      
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          data: metadata
        }
      });
      
      console.log('📝 Signup response:', { data, error });
      
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
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('❌ Password reset error:', error);
        throw error;
      }
      
      console.log('✅ Password reset email sent to:', email);
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.',
      });
      
    } catch (error: any) {
      console.error('❌ Password reset failed:', error);
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, signIn, signOut, resetPassword };
};
