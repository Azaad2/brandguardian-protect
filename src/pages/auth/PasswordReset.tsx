
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
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
  const [emailSent, setEmailSent] = useState(false);
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('');
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
    if (isSubmitting) {
      return; // Prevent multiple submissions
    }

    setIsSubmitting(true);

    try {
      console.log(`🔄 Requesting password reset for: ${data.email} (${userType})`);
      
      await resetPassword(data.email);
      
      console.log(`✅ Password reset request completed for: ${data.email}`);
      setEmailSent(true);
      setLastSubmittedEmail(data.email);
      
    } catch (error) {
      console.error('❌ Password reset error in component:', error);
      // Error is already handled in the resetPassword function
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setEmailSent(false);
    setLastSubmittedEmail('');
    form.reset();
  };

  if (emailSent) {
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
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                If an account exists with <strong>{lastSubmittedEmail}</strong>, you will receive a password reset link shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• Check your spam/junk folder if you don't see the email</p>
                  <p>• The link will expire in 1 hour</p>
                  <p>• It may take a few minutes to arrive</p>
                </div>
                
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try with different email
                </Button>
              </div>
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
  }

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
                        <Input 
                          placeholder="you@example.com" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
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
