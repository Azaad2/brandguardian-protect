
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

const AuthGuard = ({ 
  children, 
  requiredRole, 
  redirectTo = '/' 
}: AuthGuardProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Wait for authentication to complete
    if (isLoading) return;
    
    // If no user, redirect to home
    if (!user) {
      navigate(redirectTo);
      return;
    }
    
    // If role requirement specified, check if user has required role
    if (requiredRole && userRole) {
      const hasRequiredRole = Array.isArray(requiredRole) 
        ? requiredRole.includes(userRole)
        : userRole === requiredRole;
      
      if (!hasRequiredRole) {
        // Redirect to appropriate dashboard based on role
        if (userRole === 'brand') {
          navigate('/brand/dashboard');
        } else if (userRole === 'reseller') {
          navigate('/reseller/dashboard');
        } else {
          navigate(redirectTo);
        }
      }
    }
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo]);
  
  // Show nothing while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If we've passed all checks, render children
  return <>{children}</>;
};

export default AuthGuard;
