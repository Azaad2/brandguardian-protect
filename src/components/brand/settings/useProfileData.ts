
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useProfileData = () => {
  const { user } = useAuth();

  // Fetch user profile data
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;

      // Check if bio exists, if not add it to the data
      if (data && !('bio' in data)) {
        data.bio = '';
      }
      
      return data;
    },
    enabled: !!user,
  });

  return {
    profile,
    isLoading,
    user
  };
};
