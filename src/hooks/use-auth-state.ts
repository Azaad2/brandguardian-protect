
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
          try {
            const role = await fetchUserRole(session.user.id);
            setUserRole(role);
          } catch (error) {
            console.error('Error fetching user role on auth change:', error);
            setUserRole(null);
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
          setUserRole(role);
          setIsLoading(false);
        }).catch(error => {
          console.error('Error fetching initial user role:', error);
          setUserRole(null);
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
