import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

interface SendFollowUpParams {
  applicationId: string;
  followUpType: 'gentle_reminder' | 'second_followup' | 'final_followup' | 'custom';
  customMessage?: string;
}

interface FollowUpResponse {
  emailSent: boolean;
  reason?: string;
  followUpRecorded: boolean;
}

export const useFollowUp = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendFollowUpMutation = useMutation({
    mutationFn: async ({ applicationId, followUpType, customMessage }: SendFollowUpParams) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('send-follow-up-email', {
        body: {
          applicationId,
          followUpType,
          customMessage,
        },
      });

      if (error) {
        console.error('Follow-up function error:', error);
        throw new Error(error.message || 'Failed to send follow-up');
      }

      return data as FollowUpResponse;
    },
    onSuccess: (data, variables) => {
      console.log('Follow-up success:', data);
      
      if (data.emailSent) {
        toast({
          title: "Follow-up Sent",
          description: "Your follow-up email has been sent to the brand.",
        });
      } else {
        toast({
          title: "Follow-up Recorded", 
          description: data.reason || "Follow-up was recorded but email couldn't be sent.",
          variant: "destructive",
        });
      }

      // Only invalidate optimized brands to refresh the follow-up counts
      queryClient.invalidateQueries({ queryKey: ['optimized-brands'] });
    },
    onError: (error: Error) => {
      console.error('Follow-up error:', error);
      toast({
        title: "Follow-up Failed",
        description: error.message || "Failed to send follow-up. Please try again.",
        variant: "destructive",
      });
    },
  });

  const canSendFollowUp = (application: {
    status: string;
    created_at: string;
    last_follow_up_at?: string | null;
    follow_up_count: number;
  }) => {
    if (application.status !== 'pending') return false;
    if (application.follow_up_count >= 3) return false; // Max 3 follow-ups

    const now = new Date();
    const lastActivity = new Date(application.last_follow_up_at || application.created_at);
    const daysSinceLastActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    // Allow follow-up after 3 days for first follow-up, 7 days for subsequent ones
    const minDaysGap = application.follow_up_count === 0 ? 3 : 7;
    return daysSinceLastActivity >= minDaysGap;
  };

  const getFollowUpType = (followUpCount: number): SendFollowUpParams['followUpType'] => {
    switch (followUpCount) {
      case 0: return 'gentle_reminder';
      case 1: return 'second_followup';
      case 2: return 'final_followup';
      default: return 'custom';
    }
  };

  const getDaysSinceApplication = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getDaysSinceLastActivity = (createdAt: string, lastFollowUpAt?: string | null) => {
    const now = new Date();
    const lastActivity = new Date(lastFollowUpAt || createdAt);
    return Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  };

  return {
    sendFollowUp: sendFollowUpMutation.mutateAsync,
    isSendingFollowUp: sendFollowUpMutation.isPending,
    canSendFollowUp,
    getFollowUpType,
    getDaysSinceApplication,
    getDaysSinceLastActivity,
  };
};