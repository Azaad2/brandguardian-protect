
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

const BrandSignup = () => {
  return (
    <AuthLayout
      title="Create a Brand account"
      description="Sign up to manage your wholesale business efficiently"
      portalType="brand"
      footerContent={
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/brand/login" className="text-primary hover:text-primary/80 hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <SignupForm userRole="brand" />
    </AuthLayout>
  );
};

export default BrandSignup;
