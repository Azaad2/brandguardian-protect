
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

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
  bypassAuth = true  // Kept as true for testing purposes
}: AuthGuardProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessGranted, setAccessGranted] = useState(false);
  
  // Portal testing helper
  const navigateToPortal = (portal: 'brand' | 'reseller' | 'admin') => {
    navigate(`/${portal}/dashboard`);
    toast({
      title: `Switched to ${portal} portal`,
      description: `You are now viewing the ${portal} dashboard`,
    });
  };
  
  useEffect(() => {
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

  // Portal switcher for testing purposes - Always visible
  const TestingPortalSwitcher = () => {
    // Always show the portal switcher when bypassAuth is true
    if (!bypassAuth) return null;
    
    return (
      <div className="fixed top-16 right-4 z-50 bg-white p-2 rounded shadow-lg border border-gray-200">
        <div className="text-xs text-gray-500 mb-1">Testing: Switch Portal</div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs" 
            onClick={() => navigateToPortal('brand')}
          >
            Brand
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs"
            onClick={() => navigateToPortal('reseller')}
          >
            Reseller
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 text-xs"
            onClick={() => navigateToPortal('admin')}
          >
            Admin
          </Button>
        </div>
      </div>
    );
  };
  
  // Only render children if access is granted or we're bypassing auth
  return accessGranted || bypassAuth ? (
    <>
      {children}
      <TestingPortalSwitcher />
    </>
  ) : null;
};

export default AuthGuard;
