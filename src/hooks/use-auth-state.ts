
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserRole } from '@/utils/auth-utils';
import { UserRole } from '@/types/auth';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    // Get initial session immediately
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Try to get role from metadata first for faster loading
          const metadataRole = session.user.user_metadata?.user_role as UserRole;
          if (metadataRole) {
            setUserRole(metadataRole);
            setIsLoading(false);
            
            // Verify role in background
            fetchUserRole(session.user.id).then(dbRole => {
              if (mounted && dbRole && dbRole !== metadataRole) {
                setUserRole(dbRole);
              }
            }).catch(error => {
              console.error('Background role verification failed:', error);
            });
          } else {
            // Fallback to database lookup
            try {
              const role = await fetchUserRole(session.user.id);
              if (mounted) {
                setUserRole(role);
                setIsLoading(false);
              }
            } catch (error) {
              console.error('Error fetching initial user role:', error);
              if (mounted) {
                setUserRole(null);
                setIsLoading(false);
              }
            }
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Handle auth events that need role fetching
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            // Try metadata first for speed
            const metadataRole = session.user.user_metadata?.user_role as UserRole;
            if (metadataRole) {
              setUserRole(metadataRole);
              
              // Verify in background
              fetchUserRole(session.user.id).then(dbRole => {
                if (mounted && dbRole && dbRole !== metadataRole) {
                  setUserRole(dbRole);
                }
              }).catch(error => {
                console.error('Background role verification failed:', error);
              });
            } else {
              try {
                const role = await fetchUserRole(session.user.id);
                if (mounted) {
                  setUserRole(role);
                }
              } catch (error) {
                console.error(`Error fetching user role on ${event}:`, error);
                if (mounted) {
                  setUserRole(null);
                }
              }
            }
          }
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Get initial session
    getInitialSession();
    
    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, userRole, isLoading, setIsLoading };
};
