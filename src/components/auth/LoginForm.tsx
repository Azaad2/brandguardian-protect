
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  userRole: UserRole;
}

const LoginForm = ({ userRole }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsAuthenticating(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Check reseller approval if signing in as reseller
      if (userRole === 'reseller' && authData.user) {
        const { data: resellerApp, error: appError } = await supabase
          .from('reseller_applications')
          .select('status')
          .eq('user_id', authData.user.id)
          .single();

        if (appError) {
          console.error('Error fetching reseller application:', appError);
        }

        if (resellerApp?.status === 'pending') {
          throw new Error('Your reseller account is pending approval. Please wait for admin approval before logging in.');
        }
      }
      
      // Success toast
      toast({
        title: "Login successful",
        description: "Redirecting to your dashboard...",
      });

      // Navigate based on user role after successful login
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else if (userRole === 'brand') {
          navigate('/brand/dashboard');
        } else if (userRole === 'reseller') {
          navigate('/reseller/dashboard');
        }
      }, 1000);
      
    } catch (error: any) {
      // Handle different error types with more specific messaging
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      let errorTitle = 'Sign in failed';
      
      if (typeof error === 'object' && error !== null) {
        const errorCode = error.code || error.error_code;
        const errorMsg = error.message || '';
        
        if (errorMsg.includes('pending approval')) {
          errorMessage = 'Your reseller account is pending approval. Please wait for admin approval before logging in.';
          errorTitle = 'Account Pending Approval';
        } else if (errorMsg.includes('Invalid login credentials') || errorCode === 'invalid_credentials') {
          errorMessage = `Account not found or incorrect password for ${data.email}. Please check:
          
          1. Make sure the email is correct
          2. Verify your password
          3. Ensure your account has been created and confirmed
          
          If you're trying to access the admin portal with iconicpro.inc@gmail.com, please first create the account using the signup form.`;
          errorTitle = 'Invalid credentials';
        } else if (errorMsg.includes('Email not confirmed') || errorCode === 'email_not_confirmed') {
          errorMessage = 'Please check your email and click the confirmation link before logging in.';
          errorTitle = 'Email not confirmed';
        } else if (errorMsg.includes('Too many requests') || errorCode === 'too_many_requests') {
          errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.';
          errorTitle = 'Rate limited';
        } else if (errorCode === 'signup_disabled') {
          errorMessage = 'Account creation is currently disabled. Please contact support.';
          errorTitle = 'Signup disabled';
        } else if (errorMsg) {
          errorMessage = errorMsg;
        }
      }
      
      toast({
        variant: 'destructive',
        title: errorTitle,
        description: errorMessage,
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="text-right text-sm">
          <a
            href={`/reset-password?type=${userRole}`}
            className="text-primary hover:text-primary/80 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        
        <Button type="submit" className="w-full" disabled={isAuthenticating}>
          {isAuthenticating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
        
        {/* Debug information for admin portal */}
        {userRole === 'admin' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-xs">
            <div className="font-medium text-blue-800 mb-1">🔧 Debug Info:</div>
            <div className="text-blue-700">
              • If login fails, check browser console for detailed error logs<br/>
              • For iconicpro.inc@gmail.com: Ensure account exists and is confirmed<br/>
              • Try creating account first if it doesn't exist
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

export default LoginForm;
