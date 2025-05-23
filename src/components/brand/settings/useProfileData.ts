
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

      // Add bio property if it doesn't exist in the database
      if (data) {
        return {
          ...data,
          bio: data.bio || '',
        };
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
