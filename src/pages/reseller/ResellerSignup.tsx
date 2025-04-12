
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

const ResellerSignup = () => {
  return (
    <AuthLayout
      title="Create a Reseller account"
      description="Sign up to access wholesale inventory and place orders"
      portalType="reseller"
      footerContent={
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link to="/reseller/login" className="text-primary hover:text-primary/80 hover:underline">
            Sign in
          </Link>
        </div>
      }
    >
      <SignupForm userRole="reseller" />
    </AuthLayout>
  );
};

export default ResellerSignup;
