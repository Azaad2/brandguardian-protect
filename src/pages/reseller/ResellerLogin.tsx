
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import CreateTestAccount from '@/components/auth/CreateTestAccount';

const ResellerLogin = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated as a reseller
  useEffect(() => {
    if (user && userRole === 'reseller') {
      navigate('/reseller/dashboard');
    } else if (user && userRole === 'brand') {
      navigate('/brand/dashboard');
    }
  }, [user, userRole, navigate]);

  return (
    <AuthLayout
      title="Sign in to your Reseller account"
      description="Enter your credentials to access your wholesale purchasing dashboard"
      portalType="reseller"
      footerContent={
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/reseller/signup" className="text-primary hover:text-primary/80 hover:underline">
            Sign up
          </Link>
        </div>
      }
    >
      <LoginForm userRole="reseller" />
      <CreateTestAccount userRole="reseller" />
    </AuthLayout>
  );
};

export default ResellerLogin;
