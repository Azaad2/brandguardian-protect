
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

const AdminSignup = () => {
  return (
    <AuthLayout
      title="Create Admin Account"
      description="Sign up with authorized admin credentials"
      portalType="brand"
      footerContent={
        <div className="text-center text-sm space-y-2">
          <div>
            Already have an admin account?{' '}
            <Link to="/admin/login" className="text-primary hover:text-primary/80 hover:underline">
              Sign in
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            Only authorized personnel can create admin accounts
          </div>
        </div>
      }
    >
      <SignupForm userRole="admin" />
    </AuthLayout>
  );
};

export default AdminSignup;
