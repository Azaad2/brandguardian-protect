
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
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      toast({
        title: 'Account created',
        description: 'Please check your email to confirm your registration.',
      });
      
      // Redirect based on user role
      navigate(`/${metadata.user_role}/login`);
      
    } catch (error: any) {
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
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Don't navigate here - let the auth state change handle routing
      
    } catch (error: any) {
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: 'Check your email for the password reset link.',
      });
      
    } catch (error: any) {
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
