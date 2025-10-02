import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AccountRecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmail?: string;
}

export const AccountRecoveryDialog = ({ open, onOpenChange, defaultEmail = '' }: AccountRecoveryDialogProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    action: string;
    status?: string;
  } | null>(null);

  const handleCheckAccount = async () => {
    if (!email) {
      toast({
        variant: 'destructive',
        title: 'Email required',
        description: 'Please enter your email address',
      });
      return;
    }

    setIsChecking(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('reseller-account-recovery', {
        body: { email },
      });

      if (error) throw error;

      setResult(data);

      // Show appropriate toast
      if (data.success) {
        toast({
          title: 'Success!',
          description: data.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Account Check',
          description: data.message,
        });
      }
    } catch (error: any) {
      console.error('Account recovery error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to check account status. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getActionButton = () => {
    if (!result) return null;

    switch (result.action) {
      case 'check_email':
        return (
          <Button onClick={() => onOpenChange(false)} className="w-full">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Done
          </Button>
        );
      case 'wait':
        return (
          <Button onClick={() => onOpenChange(false)} variant="outline" className="w-full">
            I'll wait for approval
          </Button>
        );
      case 'contact_support':
      case 'contact_admin':
        return (
          <Button asChild variant="outline" className="w-full">
            <a href="mailto:support@bndbox.com">
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </a>
          </Button>
        );
      case 'apply':
        return (
          <Button asChild className="w-full">
            <a href="/reseller-hub">Apply Now</a>
          </Button>
        );
      default:
        return (
          <Button onClick={() => setResult(null)} variant="outline" className="w-full">
            Try Again
          </Button>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Account Access</DialogTitle>
          <DialogDescription>
            Enter your email to check your reseller application status and get help accessing your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!result ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isChecking}
                />
              </div>

              <Button
                onClick={handleCheckAccount}
                disabled={isChecking}
                className="w-full"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  'Check Account Status'
                )}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`flex items-start gap-3 p-4 rounded-lg ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-yellow-50 border border-yellow-200'
              }`}>
                {result.success ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    result.success ? 'text-green-900' : 'text-yellow-900'
                  }`}>
                    {result.message}
                  </p>
                  {result.status && (
                    <p className={`text-xs mt-1 ${
                      result.success ? 'text-green-700' : 'text-yellow-700'
                    }`}>
                      Status: {result.status.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>

              {getActionButton()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
