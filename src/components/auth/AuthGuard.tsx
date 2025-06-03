
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

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
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);
  
  useEffect(() => {
    console.log('AuthGuard check:', { user: !!user, userRole, isLoading, requiredRole, bypassAuth });
    
    // Reset access check when role changes
    setHasCheckedAccess(false);
    setAccessGranted(false);
    
    // If bypassing auth, grant access immediately
    if (bypassAuth) {
      console.log('Bypassing auth, granting access');
      setAccessGranted(true);
      setHasCheckedAccess(true);
      return;
    }
    
    // Wait for authentication to complete
    if (isLoading) {
      console.log('Still loading auth, waiting...');
      return;
    }
    
    // For admin portal - require authentication and verify admin role from database
    if (requiredRole === 'admin') {
      if (!user) {
        console.log('No user found, redirecting to admin login');
        navigate('/admin/login');
        setHasCheckedAccess(true);
        return;
      } else {
        // Double-check admin role from database for admin access
        const verifyAdminRole = async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('user_role')
              .eq('id', user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error checking user profile:', profileError);
              navigate('/admin/login');
              setHasCheckedAccess(true);
              return;
            }
            
            if (profileData && profileData.user_role === 'admin') {
              console.log('Admin role verified from database, granting access');
              setAccessGranted(true);
            } else {
              console.log('User is not admin, redirecting to admin login');
              navigate('/admin/login');
            }
            setHasCheckedAccess(true);
          } catch (error) {
            console.error('Error verifying admin role:', error);
            navigate('/admin/login');
            setHasCheckedAccess(true);
          }
        };
        
        verifyAdminRole();
        return;
      }
    }
    
    // If no user, redirect to appropriate login based on required role
    if (!user) {
      console.log('No user found, redirecting based on required role:', requiredRole);
      if (requiredRole === 'brand') {
        navigate('/brand/login');
      } else if (requiredRole === 'reseller') {
        navigate('/reseller/login');
      } else {
        navigate(redirectTo);
      }
      setHasCheckedAccess(true);
      return;
    }
    
    // For non-admin portals, check roles normally
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
        } else {
          navigate(redirectTo);
        }
        setHasCheckedAccess(true);
        return;
      }
    }
    
    // If we got here, access is granted
    console.log('Access granted!');
    setAccessGranted(true);
    setHasCheckedAccess(true);
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo, bypassAuth]);
  
  // Show loading indicator while checking auth
  if (!bypassAuth && (isLoading || !hasCheckedAccess)) {
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
