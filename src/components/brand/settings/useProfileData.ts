
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
      
      // The bio field now exists in the database, so we don't need to add it manually
      // But we'll ensure it's never undefined in our application logic
      return {
        ...data,
        bio: data.bio || '',
      };
    },
    enabled: !!user,
  });

  return {
    profile,
    isLoading,
    user
  };
};
