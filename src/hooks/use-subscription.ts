
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

export interface Subscription {
  id: string;
  user_id: string;
  email: string;
  stripe_customer_id: string | null;
  subscribed: boolean;
  subscription_tier: string;
  brand_application_limit: number;
  subscription_end: string | null;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's subscription status
  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Fetching subscription for user:', user.id);
      
      // First check if subscription exists
      const { data: existingSubscription, error: fetchError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', fetchError);
        throw fetchError;
      }
      
      // If no subscription exists, create a default free one
      if (!existingSubscription) {
        console.log('No subscription found, creating default free subscription');
        const { data: newSubscription, error: createError } = await supabase
          .from('subscribers')
          .insert([{
            user_id: user.id,
            email: user.email!,
            subscribed: false,
            subscription_tier: 'free',
            brand_application_limit: 999999
          }])
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating default subscription:', createError);
          throw createError;
        }
        
        console.log('Created default subscription:', newSubscription);
        return newSubscription as Subscription;
      }
      
      console.log('Found existing subscription:', existingSubscription);
      return existingSubscription as Subscription;
    },
    enabled: !!user,
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async (updates: Partial<Subscription>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscribers')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast({
        title: 'Subscription Updated',
        description: 'Your subscription has been successfully updated.',
      });
    },
    onError: (error) => {
      console.error('Subscription update failed:', error);
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    subscription,
    isLoading,
    error,
    updateSubscription: updateSubscriptionMutation.mutate,
    isUpdating: updateSubscriptionMutation.isPending,
  };
};
