import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePublicAuth } from '@/hooks/use-public-auth';
import { AuthProvider } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';

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
    if (user && session) {
      // Get user role from session metadata
      const roleFromMetadata = user.user_metadata?.user_role || session.user?.user_metadata?.user_role;
      if (roleFromMetadata) {
        setUserRole(roleFromMetadata as UserRole);
        setRoleLoading(false);
      }
    } else {
      setUserRole(null);
      setRoleLoading(false);
    }
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