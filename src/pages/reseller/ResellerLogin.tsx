
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect, useState } from 'react';
import { usePublicAuth } from '@/hooks/use-public-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { AccountRecoveryDialog } from '@/components/auth/AccountRecoveryDialog';

const ResellerLogin = () => {
  const { user, isLoading } = usePublicAuth();
  const navigate = useNavigate();
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated resellers to their dashboard
      navigate('/reseller/dashboard');
    }
  }, [user, navigate, isLoading]);

  return (
    <>
      <AuthLayout
        title="Sign in to your Reseller account"
        description="Enter your credentials to access your wholesale purchasing dashboard"
        portalType="reseller"
        footerContent={
          <div className="space-y-3">
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowRecoveryDialog(true)}
                className="w-full"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Can't Login? Request Account Access
              </Button>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{' '}
              <Link to="/reseller-hub" className="text-primary hover:text-primary/80 hover:underline">
                Apply as Reseller
              </Link>
            </div>
          </div>
        }
      >
        <LoginForm userRole="reseller" />
      </AuthLayout>

      <AccountRecoveryDialog
        open={showRecoveryDialog}
        onOpenChange={setShowRecoveryDialog}
      />
    </>
  );
};

export default ResellerLogin;
