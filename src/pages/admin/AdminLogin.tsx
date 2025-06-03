
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { updateUserRole } from '@/utils/update-user-role';

const AdminLogin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!isLoading && user) {
        console.log('AdminLogin: Checking admin access for user:', user.email);
        setIsCheckingRole(true);
        try {
          // Check if user has admin role
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .maybeSingle();
          
          console.log('AdminLogin: Profile data:', profileData);
          console.log('AdminLogin: Profile error:', profileError);
          
          if (profileError) {
            console.error('Error checking user profile:', profileError);
            // If the user is iconicpro.inc@gmail.com, automatically make them admin
            if (user.email === 'iconicpro.inc@gmail.com') {
              console.log('Auto-promoting iconicpro.inc@gmail.com to admin');
              try {
                const result = await updateUserRole(user.id, 'admin');
                console.log('Admin promotion result:', result);
                toast({
                  title: "Admin Access Granted",
                  description: "You have been automatically promoted to admin",
                });
                navigate('/admin/dashboard');
                return;
              } catch (error) {
                console.error('Error promoting to admin:', error);
                toast({
                  variant: "destructive",
                  title: "Promotion failed",
                  description: "Failed to promote user to admin. Please try using /update-role",
                });
              }
            }
            
            toast({
              variant: "destructive",
              title: "Access denied",
              description: "Unable to verify admin permissions. If you're the owner (iconicpro.inc@gmail.com), please visit /update-role to get admin access.",
            });
            return;
          }
          
          if (profileData && profileData.user_role === 'admin') {
            console.log('User is already admin, redirecting to dashboard');
            toast({
              title: "Welcome Admin",
              description: "Redirecting to admin dashboard",
            });
            navigate('/admin/dashboard');
          } else {
            console.log('User profile exists but not admin. Current role:', profileData?.user_role);
            // If the user is iconicpro.inc@gmail.com but not admin, promote them
            if (user.email === 'iconicpro.inc@gmail.com') {
              console.log('Auto-promoting iconicpro.inc@gmail.com to admin');
              try {
                const result = await updateUserRole(user.id, 'admin');
                console.log('Admin promotion result:', result);
                toast({
                  title: "Admin Access Granted",
                  description: "You have been automatically promoted to admin",
                });
                navigate('/admin/dashboard');
                return;
              } catch (error) {
                console.error('Error promoting to admin:', error);
                toast({
                  variant: "destructive",
                  title: "Promotion failed",
                  description: "Failed to promote user to admin. Please try using /update-role",
                });
              }
            }
            
            toast({
              variant: "destructive",
              title: "Access denied",
              description: user.email === 'iconicpro.inc@gmail.com' 
                ? "Please visit /update-role to get admin access" 
                : "You do not have admin privileges. Contact the administrator for access.",
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
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-red-400 mx-auto"></div>
          <p className="text-white mt-4">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-400" />
            <span className="text-2xl font-bold text-white">Admin Portal</span>
          </div>
        </div>
        <div className="mb-3 text-center">
          <h1 className="text-xl font-semibold text-red-400">SECURE ACCESS</h1>
          <p className="text-sm text-slate-300">Administrative Login Required</p>
        </div>
        <Card className="border-red-200 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Admin Portal Login
            </CardTitle>
            <CardDescription className="text-slate-600">
              Enter your admin credentials to access the management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm userRole="admin" />
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 px-6 py-4">
            <div className="text-center text-sm space-y-2">
              <div className="text-slate-600">
                Don't have an admin account?{' '}
                <Link to="/admin/signup" className="text-red-600 hover:text-red-700 hover:underline font-medium">
                  Create account
                </Link>
              </div>
              <div className="text-slate-600">
                Need admin access?{' '}
                <Link to="/update-role" className="text-red-600 hover:text-red-700 hover:underline font-medium">
                  Request access
                </Link>
              </div>
              <div className="text-xs text-slate-500 bg-red-50 px-3 py-1 rounded">
                🔒 Admin portal is for authorized personnel only
              </div>
              <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded">
                💡 Use iconicpro.inc@gmail.com for automatic admin access
              </div>
              <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded">
                🔧 Debug mode enabled - check browser console for logs
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
