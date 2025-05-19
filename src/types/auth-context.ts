
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from './auth';

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata: { 
    full_name: string;
    company_name: string;
    user_role: UserRole;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
