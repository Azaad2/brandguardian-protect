// utils/checkEmailExists.ts
import { supabase } from '@/integrations/supabase/client';

export const checkEmailExists = async (email: string): Promise<boolean> => {
  // Only check profiles table since reseller_applications requires admin access
  // Duplicate email checks will be handled by backend constraints
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (profilesError) {
    console.error('Error checking profiles:', profilesError);
    return false; // Return false instead of throwing on error
  }

  return profiles && profiles.length > 0;
};
