import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface PublicAuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const PublicAuthContext = createContext<PublicAuthContextType | undefined>(undefined);

export const PublicAuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener for session changes only
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    isLoading,
  };

  return <PublicAuthContext.Provider value={value}>{children}</PublicAuthContext.Provider>;
};

export const usePublicAuth = () => {
  const context = useContext(PublicAuthContext);
  if (!context) {
    throw new Error('usePublicAuth must be used within a PublicAuthProvider');
  }
  return context;
};