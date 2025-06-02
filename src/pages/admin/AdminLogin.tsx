
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AdminLogin = () => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated as an admin
  useEffect(() => {
    if (!isLoading) {
      if (user && userRole === 'admin') {
        toast({
          title: "Login successful",
          description: "Redirecting to admin dashboard",
        });
        navigate('/admin/dashboard');
      } else if (user && (userRole === 'brand' || userRole === 'reseller')) {
        toast({
          description: "You don't have admin access. Please contact an administrator.",
          variant: 'destructive'
        });
        navigate('/');
      }
    }
  }, [user, userRole, navigate, isLoading]);

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
