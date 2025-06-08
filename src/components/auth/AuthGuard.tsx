
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
    console.log('AuthGuard check:', { 
      user: !!user, 
      userRole, 
      isLoading, 
      requiredRole, 
      bypassAuth,
      hasCheckedAccess
    });
    
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

    // If no user, redirect to appropriate login page
    if (!user) {
      console.log('No user found, redirecting based on required role:', requiredRole);
      if (!hasCheckedAccess) {
        if (requiredRole === 'admin') {
          navigate('/admin/login');
        } else if (requiredRole === 'brand') {
          navigate('/brand/login');
        } else if (requiredRole === 'reseller') {
          navigate('/reseller/login');
        } else {
          navigate(redirectTo);
        }
        setHasCheckedAccess(true);
      }
      return;
    }
    
    // For admin portal - special verification
    if (requiredRole === 'admin') {
      const verifyAdminRole = async () => {
        try {
          console.log('Verifying admin role for user:', user.email);
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .maybeSingle();
          
          console.log('Admin verification result:', { profileData, profileError });
          
          // Check if user has admin role in profile or metadata
          const hasAdminRole = profileData?.user_role === 'admin' || user.user_metadata?.user_role === 'admin';
          
          if (hasAdminRole) {
            console.log('Admin role verified, granting access');
            setAccessGranted(true);
          } else {
            console.log('User is not admin, redirecting to login');
            if (!hasCheckedAccess) {
              navigate('/admin/login');
            }
          }
          setHasCheckedAccess(true);
        } catch (error) {
          console.error('Error verifying admin role:', error);
          if (!hasCheckedAccess) {
            navigate('/admin/login');
            setHasCheckedAccess(true);
          }
        }
      };
      
      if (!hasCheckedAccess) {
        verifyAdminRole();
      }
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
        if (!hasCheckedAccess) {
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
          setHasCheckedAccess(true);
        }
        return;
      }
    }
    
    // If we got here, access is granted
    console.log('Access granted!');
    setAccessGranted(true);
    setHasCheckedAccess(true);
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo, bypassAuth, hasCheckedAccess]);
  
  // Show loading indicator while checking auth
  if (!bypassAuth && (isLoading || !hasCheckedAccess)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Loading...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Only render children if access is granted
  return accessGranted ? <>{children}</> : null;
};

export default AuthGuard;
