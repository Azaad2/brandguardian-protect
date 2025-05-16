
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const BrandLogin = () => {
  return (
    <AuthLayout
      title="Sign in to your Brand account"
      description="Enter your credentials to access your wholesale management dashboard"
      portalType="brand"
      footerContent={
        <div className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/brand/signup" className="text-primary hover:text-primary/80 hover:underline">
            Sign up
          </Link>
        </div>
      }
    >
      <LoginForm userRole="brand" />
    </AuthLayout>
  );
};

export default BrandLogin;
