
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  bypassAuth?: boolean;
}

const AuthGuard = ({ 
  children, 
  requiredRole, 
  redirectTo = '/',
  bypassAuth = false
}: AuthGuardProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  
  useEffect(() => {
    console.log('AuthGuard check:', { user: !!user, userRole, isLoading, requiredRole, bypassAuth });
    
    // If bypassing auth, grant access immediately
    if (bypassAuth) {
      console.log('Bypassing auth, granting access');
      setAccessGranted(true);
      return;
    }
    
    // Wait for authentication to complete
    if (isLoading) {
      console.log('Still loading auth, waiting...');
      return;
    }
    
    // If no user, redirect to appropriate login based on required role
    if (!user) {
      console.log('No user found, redirecting based on required role:', requiredRole);
      if (requiredRole === 'admin') {
        navigate('/');
      } else if (requiredRole === 'brand') {
        navigate('/brand/login');
      } else if (requiredRole === 'reseller') {
        navigate('/reseller/login');
      } else {
        navigate(redirectTo);
      }
      return;
    }
    
    // If role requirement specified, check if user has required role
    if (requiredRole && userRole) {
      const hasRequiredRole = Array.isArray(requiredRole) 
        ? requiredRole.includes(userRole)
        : userRole === requiredRole;
      
      console.log('Role check:', { userRole, requiredRole, hasRequiredRole });
      
      if (!hasRequiredRole) {
        console.log('User does not have required role, redirecting based on their role');
        // Redirect based on user's actual role
        if (userRole === 'brand') {
          navigate('/brand/dashboard');
        } else if (userRole === 'reseller') {
          navigate('/reseller/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate(redirectTo);
        }
        return;
      }
    }
    
    // If we got here, access is granted
    console.log('Access granted!');
    setAccessGranted(true);
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo, bypassAuth]);
  
  // Show loading indicator while checking auth
  if (!bypassAuth && (isLoading || !accessGranted)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Only render children if access is granted
  return accessGranted ? <>{children}</> : null;
};

export default AuthGuard;
