
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
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
  const { signIn, isLoading } = useAuth();
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
      await signIn(data.email, data.password);
      
      // Success message will be shown from auth hooks
      // Redirection will be handled by the ResellerLogin component
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle different error types
      let errorMessage = 'Please check your credentials and try again';
      
      if (error.message === 'Email not confirmed') {
        errorMessage = 'Please check your email to confirm your account before logging in';
      } else if (error.message?.includes('Invalid login')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message?.includes('Too many requests')) {
        errorMessage = 'Too many login attempts. Please try again later';
      }
      
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
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
            href="/reset-password"
            className="text-primary hover:text-primary/80 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        
        <Button type="submit" className="w-full" disabled={isAuthenticating || isLoading}>
          {(isAuthenticating || isLoading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
