
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
  bypassAuth = false  // Changed to false for proper authentication
}: AuthGuardProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  
  useEffect(() => {
    console.log('AuthGuard check:', { user, userRole, isLoading, requiredRole, bypassAuth });
    
    // If bypassing auth, grant access immediately
    if (bypassAuth) {
      setAccessGranted(true);
      return;
    }
    
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
      
      console.log('Role check:', { userRole, requiredRole, hasRequiredRole });
      
      if (!hasRequiredRole) {
        // Redirect based on role
        if (userRole === 'brand') {
          navigate('/brand/dashboard');
        } else if (userRole === 'reseller') {
          navigate('/reseller/dashboard');
        } else {
          navigate(redirectTo);
        }
        return;
      }
    }
    
    // If we got here, access is granted
    setAccessGranted(true);
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo, bypassAuth]);
  
  // Show loading indicator while checking auth
  if (!bypassAuth && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Only render children if access is granted or we're bypassing auth
  return accessGranted || bypassAuth ? children : null;
};

export default AuthGuard;
