
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
    setIsLoading(true);
    
    // Set up auth state listener FIRST to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id || 'no user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Handle auth events that need role fetching
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
            try {
              const role = await fetchUserRole(session.user.id);
              setUserRole(role);
              
              // If no role is found but we have user metadata with a role, use that
              if (!role && session.user.user_metadata?.user_role) {
                setUserRole(session.user.user_metadata.user_role as UserRole);
              }
            } catch (error) {
              console.error(`Error fetching user role on ${event}:`, error);
              
              // Fallback to metadata role if available
              if (session.user.user_metadata?.user_role) {
                setUserRole(session.user.user_metadata.user_role as UserRole);
              } else {
                setUserRole(null);
              }
            }
          }
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          // If no role found but user has metadata with role, use that
          if (!role && session.user.user_metadata?.user_role) {
            setUserRole(session.user.user_metadata.user_role as UserRole);
          } else {
            setUserRole(role);
          }
          setIsLoading(false);
        }).catch(error => {
          console.error('Error fetching initial user role:', error);
          
          // Fallback to metadata role if available
          if (session.user.user_metadata?.user_role) {
            setUserRole(session.user.user_metadata.user_role as UserRole);
          } else {
            setUserRole(null);
          }
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    }).catch(error => {
      console.error('Error getting initial session:', error);
      setIsLoading(false);
    });
    
    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, []);

  return { session, user, userRole, isLoading, setIsLoading };
};

