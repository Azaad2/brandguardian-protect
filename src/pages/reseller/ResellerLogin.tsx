
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { usePublicAuth } from '@/hooks/use-public-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const ResellerLogin = () => {
  const { user, isLoading } = usePublicAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      // For login pages, we just redirect to home and let the main app handle role-based routing
      navigate('/');
    }
  }, [user, navigate, isLoading]);

  return (
    <AuthLayout
      title="Sign in to your Reseller account"
      description="Enter your credentials to access your wholesale purchasing dashboard"
      portalType="reseller"
      footerContent={
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/reseller-hub" className="text-primary hover:text-primary/80 hover:underline">
            Sign up
          </Link>
        </div>
      }
    >
      <LoginForm userRole="reseller" />
    </AuthLayout>
  );
};

export default ResellerLogin;
