import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePublicAuth } from '@/hooks/use-public-auth';
import { AuthProvider } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { session, user, isLoading } = usePublicAuth();
  const location = useLocation();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    const resolveRole = async () => {
      if (user && session) {
        // Try metadata first
        const roleFromMetadata = user.user_metadata?.user_role || session.user?.user_metadata?.user_role;
        if (roleFromMetadata) {
          setUserRole(roleFromMetadata as UserRole);
          setRoleLoading(false);
          return;
        }
        // Fallback: fetch from profiles table
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .single();
          if (!error && data?.user_role) {
            setUserRole(data.user_role as UserRole);
          } else {
            setUserRole(null);
          }
        } catch {
          setUserRole(null);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setUserRole(null);
        setRoleLoading(false);
      }
    };
    setRoleLoading(true);
    resolveRole();
  }, [user, session]);

  if (isLoading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to={`/${requiredRole || 'reseller'}/login`} state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Only load the full AuthProvider for protected routes
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export default ProtectedRoute;