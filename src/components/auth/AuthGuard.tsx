
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[] | null;
  redirectTo?: string;
  bypassAuth?: boolean;
  redirectIfAuthenticated?: string; // New prop for login/signup pages
}

const AuthGuard = ({ 
  children, 
  requiredRole, 
  redirectTo = '/',
  bypassAuth = false,
  redirectIfAuthenticated
}: AuthGuardProps) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();
  const [accessGranted, setAccessGranted] = useState(false);
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);
  
  useEffect(() => {
    // If bypassing auth, grant access immediately
    if (bypassAuth) {
      setAccessGranted(true);
      setHasCheckedAccess(true);
      return;
    }
    
    // Wait for authentication to complete
    if (isLoading) {
      return;
    }

    // Handle redirectIfAuthenticated (for login/signup pages)
    if (redirectIfAuthenticated && user) {
      if (!hasCheckedAccess) {
        navigate(redirectIfAuthenticated);
        setHasCheckedAccess(true);
      }
      return;
    }

    // If no user and we need authentication, redirect to login
    if (!user && requiredRole !== null) {
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
    if (requiredRole === 'admin' && user) {
      const verifyAdminRole = async () => {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .maybeSingle();
          
          // Check if user has admin role in profile or metadata
          const hasAdminRole = profileData?.user_role === 'admin' || user.user_metadata?.user_role === 'admin';
          
          if (hasAdminRole) {
            setAccessGranted(true);
          } else {
            if (!hasCheckedAccess) {
              navigate('/admin/login');
            }
          }
          setHasCheckedAccess(true);
        } catch (error) {
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
    
    // For role-based access control
    if (requiredRole && userRole && user) {
      const hasRequiredRole = Array.isArray(requiredRole) 
        ? requiredRole.includes(userRole)
        : userRole === requiredRole;
      
      if (!hasRequiredRole) {
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
    setAccessGranted(true);
    setHasCheckedAccess(true);
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo, bypassAuth, redirectIfAuthenticated, hasCheckedAccess]);
  
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
