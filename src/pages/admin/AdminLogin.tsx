
import { Link } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isLoading && user) {
        setIsCheckingRole(true);
        try {
          // Check if user has admin role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error checking user profile:', profileError);
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "Unable to verify admin permissions",
            });
            return;
          }
          
          if (profileData && profileData.user_role === 'admin') {
            toast({
              title: "Welcome Admin",
              description: "Redirecting to admin dashboard",
            });
            navigate('/admin/dashboard');
          } else {
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "You do not have admin privileges",
            });
          }
        } catch (error) {
          console.error('Error checking admin access:', error);
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "Unable to verify admin permissions",
          });
        } finally {
          setIsCheckingRole(false);
        }
      }
    };

    checkAdminAccess();
  }, [user, navigate, isLoading]);

  // Show loading while checking auth or role
  if (isLoading || isCheckingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Admin Portal Login"
      description="Enter your admin credentials to access the management dashboard"
      portalType="brand"
      footerContent={
        <div className="text-center text-sm space-y-2">
          <div>
            Don't have an admin account?{' '}
            <Link to="/admin/signup" className="text-primary hover:text-primary/80 hover:underline">
              Create account
            </Link>
          </div>
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
