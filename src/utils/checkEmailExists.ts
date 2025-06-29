// utils/checkEmailExists.ts
import { supabase } from '@/integrations/supabase/client';

export const checkEmailExists = async (email: string): Promise<boolean> => {
  // Check reseller_applications
  const { data: resellerApps, error: resellerError } = await supabase
    .from('reseller_applications')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (resellerError) {
    console.error('Error checking reseller_applications:', resellerError);
    throw resellerError;
  }

  if (resellerApps && resellerApps.length > 0) return true;

  // Check profiles table
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .limit(1);

  if (profilesError) {
    console.error('Error checking profiles:', profilesError);
    throw profilesError;
  }

  return profiles.length > 0;
};
