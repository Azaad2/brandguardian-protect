
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const ResellerLogin = () => {
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
    </AuthLayout>
  );
};

export default ResellerLogin;
