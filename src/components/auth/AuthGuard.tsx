
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
  const [isVerifying, setIsVerifying] = useState(false);
  
  useEffect(() => {
    console.log('AuthGuard check:', { 
      user: !!user, 
      userRole, 
      isLoading, 
      requiredRole, 
      bypassAuth,
      hasCheckedAccess,
      isVerifying
    });
    
    // Prevent multiple simultaneous checks
    if (isVerifying) {
      console.log('Already verifying, skipping...');
      return;
    }
    
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

    // If no user, redirect appropriately
    if (!user) {
      console.log('No user found, redirecting based on required role:', requiredRole);
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
      return;
    }
    
    // For admin portal - special verification with retry logic
    if (requiredRole === 'admin') {
      setIsVerifying(true);
      
      const verifyAdminRole = async () => {
        try {
          console.log('Verifying admin role for user:', user.email);
          
          // Wait a moment for any profile updates to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .maybeSingle();
          
          console.log('Admin verification result:', { profileData, profileError });
          
          if (profileError) {
            console.error('Error checking user profile:', profileError);
          }
          
          // Check if user has admin role in profile
          if (profileData && profileData.user_role === 'admin') {
            console.log('Admin role verified in profile, granting access');
            setAccessGranted(true);
            setHasCheckedAccess(true);
            setIsVerifying(false);
            return;
          }
          
          // If metadata says admin but profile doesn't exist or isn't admin, try to fix it
          if (user.user_metadata?.user_role === 'admin') {
            console.log('User metadata indicates admin, attempting to ensure profile is correct');
            
            try {
              const { error: upsertError } = await supabase
                .from('profiles')
                .upsert({
                  id: user.id,
                  email: user.email || '',
                  full_name: user.user_metadata?.full_name || '',
                  company_name: user.user_metadata?.company_name || '',
                  user_role: 'admin'
                }, {
                  onConflict: 'id'
                });
              
              if (!upsertError) {
                console.log('Successfully ensured admin profile, granting access');
                setAccessGranted(true);
                setHasCheckedAccess(true);
                setIsVerifying(false);
                return;
              }
            } catch (error) {
              console.error('Error ensuring admin profile:', error);
            }
          }
          
          console.log('User is not admin, redirecting to login');
          // Only redirect if we haven't already checked
          if (!hasCheckedAccess) {
            navigate('/admin/login');
            setHasCheckedAccess(true);
          }
          setIsVerifying(false);
        } catch (error) {
          console.error('Error verifying admin role:', error);
          // Only redirect if we haven't already checked
          if (!hasCheckedAccess) {
            navigate('/admin/login');
            setHasCheckedAccess(true);
          }
          setIsVerifying(false);
        }
      };
      
      verifyAdminRole();
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
  }, [user, userRole, isLoading, requiredRole, navigate, redirectTo, bypassAuth, hasCheckedAccess, isVerifying]);
  
  // Show loading indicator while checking auth
  if (!bypassAuth && (isLoading || !hasCheckedAccess || isVerifying)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isLoading ? 'Loading...' : isVerifying ? 'Verifying access...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }
  
  // Only render children if access is granted
  return accessGranted ? <>{children}</> : null;
};

export default AuthGuard;
