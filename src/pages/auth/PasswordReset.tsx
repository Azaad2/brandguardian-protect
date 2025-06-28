
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type PasswordResetFormValues = z.infer<typeof formSchema>;

const PasswordReset = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const userType = searchParams.get('type') || 'brand';

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: PasswordResetFormValues) => {
    setIsSubmitting(true);

    try {
      console.log(`🔄 Requesting password reset for: ${data.email} (${userType})`);
      
      await resetPassword(data.email);
      
      toast({
        title: 'Reset link sent',
        description: 'If an account exists with that email, you will receive a password reset link.',
        duration: 5000,
      });

      console.log(`✅ Password reset email sent for: ${data.email}`);

      // Go back to login page after showing the toast
      setTimeout(() => {
        navigate(`/${userType}/login`);
      }, 2000);
      
    } catch (error) {
      console.error('❌ Password reset error:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/" className="inline-block">
            <BndBoxLogo className="h-12 w-auto" />
          </Link>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={userType} className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="brand"
                  onClick={() => navigate('/reset-password?type=brand')}
                >
                  Brand
                </TabsTrigger>
                <TabsTrigger 
                  value="reseller"
                  onClick={() => navigate('/reset-password?type=reseller')}
                >
                  Reseller
                </TabsTrigger>
              </TabsList>
            </Tabs>

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
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 px-6 py-4">
            <div className="text-center text-sm">
              Remember your password?{' '}
              <Link to={`/${userType}/login`} className="text-primary hover:text-primary/80 hover:underline">
                Go back to sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PasswordReset;
