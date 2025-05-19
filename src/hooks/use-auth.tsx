
import { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from './use-auth-state';
import { useAuthActions } from './use-auth-actions';
import { AuthContextType } from '@/types/auth-context';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { session, user, userRole, isLoading, setIsLoading } = useAuthState();
  const { signUp, signIn, signOut, resetPassword } = useAuthActions({ setIsLoading });
  
  const value = {
    session,
    user,
    userRole,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
