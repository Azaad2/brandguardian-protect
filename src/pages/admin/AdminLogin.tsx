
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Only redirect if already authenticated - let AuthGuard handle role verification
  useEffect(() => {
    if (!isLoading && user) {
      toast({
        title: "Already logged in",
        description: "Redirecting to admin dashboard",
      });
      navigate('/admin/dashboard');
    }
  }, [user, navigate, isLoading]);

  return (
    <AuthLayout
      title="Admin Portal Login"
      description="Enter your admin credentials to access the management dashboard"
      portalType="brand" // Using brand styling for consistency
      footerContent={
        <div className="text-center text-sm space-y-2">
          <div>
            Need admin access?{' '}
            <Link to="/update-role" className="text-primary hover:text-primary/80 hover:underline">
              Request access
            </Link>
          </div>
          <div className="text-xs text-gray-500">
            Admin portal is for authorized personnel only
          </div>
        </div>
      }
    >
      <LoginForm userRole="admin" />
    </AuthLayout>
  );
};

export default AdminLogin;
