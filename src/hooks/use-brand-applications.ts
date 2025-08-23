import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';

export interface BrandApplication {
  id: string;
  reseller_id: string;
  brand_id: string;
  status: 'pending' | 'approved' | 'rejected';
  email_thread_id: string | null;
  application_data: any;
  created_at: string;
  updated_at: string;
  follow_up_count: number;
  last_follow_up_at: string | null;
  response_expected_by: string | null;
  brand?: {
    name: string;
    website_url: string | null;
    description: string | null;
    contact_email: string;
    logo_url: string | null;
    categories: string[] | null;
    department: string | null;
    approval_rate: number | null;
    response_time: number | null;
  };
}

export const useBrandApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's applications
  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['brand-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching brand applications for user:', user.id);
      
      const { data, error } = await supabase
        .from('brand_applications')
        .select(`
          *,
          brand:brands_directory(
            name,
            website_url,
            description,
            contact_email,
            logo_url,
            categories,
            department,
            approval_rate,
            response_time
          )
        `)
        .eq('reseller_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching brand applications:', error);
        throw error;
      }
      
      console.log('Brand applications fetched:', data);
      return data as BrandApplication[];
    },
    enabled: !!user,
  });

  // Get subscription info for limit checking
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data: existingSubscription, error: fetchError } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      if (!existingSubscription) {
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
        
        if (createError) throw createError;
        return newSubscription;
      }
      
      return existingSubscription;
    },
    enabled: !!user,
  });

  // Check if user can apply to more brands - now always true (unlimited)
  const canApplyToMoreBrands = () => {
    return true; // Unlimited applications for all users
  };

  // Apply to brand mutation with limit checking
  const applyToBrandMutation = useMutation({
    mutationFn: async ({ brandId, applicationData }: { brandId: string; applicationData?: any }) => {
      if (!user) throw new Error('User not authenticated');

      // No application limits - users can apply to unlimited brands

      console.log('Applying to brand:', brandId, 'for user:', user.id);

      // Generate unique email thread ID
      const emailThreadId = `app_${brandId}_${user.id}_${Date.now()}`;

      // Create prefilled proposal message
      const proposalMessage = `I am interested in becoming an authorized reseller for your products on Amazon and other major marketplaces. 

As a verified reseller on the BndBox platform, I have the experience and resources to effectively market and sell your products to reach new customers and expand your market presence.

I would like to discuss wholesale pricing, minimum order quantities, and partnership terms that would be mutually beneficial for both of our businesses.

I look forward to the opportunity to work together and help grow your brand's reach through strategic online retail partnerships.`;

      const enrichedApplicationData = {
        ...applicationData,
        proposal_message: proposalMessage,
      };

      const { data, error } = await supabase
        .from('brand_applications')
        .insert([{
          reseller_id: user.id,
          brand_id: brandId,
          email_thread_id: emailThreadId,
          application_data: enrichedApplicationData,
          status: 'pending'
        }])
        .select(`
          *,
          brand:brands_directory(
            name,
            website_url,
            description,
            contact_email,
            logo_url,
            categories,
            department,
            approval_rate,
            response_time
          )
        `)
        .single();
      
      if (error) {
        console.error('Error applying to brand:', error);
        throw error;
      }

      console.log('Brand application created:', data);

      // Send email notification to brand if contact email exists
      if (data.brand?.contact_email) {
        try {
          await supabase.functions.invoke('send-brand-application-email', {
            body: {
              brandEmail: data.brand.contact_email,
              brandName: data.brand.name,
              emailThreadId,
              applicationId: data.id,
              resellerInfo: {
                id: user.id,
                email: user.email,
              }
            }
          });
          console.log('Application email sent successfully');
        } catch (emailError) {
          console.error('Failed to send application email:', emailError);
          // Don't throw error for email failure, application was still created
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-applications'] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      toast({
        title: 'Application Submitted!',
        description: 'Your application has been sent to the brand. You will receive updates in your messages.',
      });
    },
    onError: (error) => {
      console.error('Brand application failed:', error);
      toast({
        title: 'Application Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    applications,
    isLoading,
    error,
    applyToBrand: applyToBrandMutation.mutate,
    isApplying: applyToBrandMutation.isPending,
    canApplyToMoreBrands: canApplyToMoreBrands(),
    applicationCount: applications?.length || 0,
    applicationLimit: 999999, // Unlimited applications
    subscriptionTier: subscription?.subscription_tier || 'free',
  };
};

export const useAvailableBrands = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-brands', user?.id],
    queryFn: async () => {
      if (!user) {
        console.log('useAvailableBrands: No user found, returning empty brands list');
        return [];
      }

      console.log('useAvailableBrands: Fetching available brands for user:', user.id);

      try {
        // Get brands allocated to this reseller
        const { data: allocatedBrands, error: allocationsError } = await supabase
          .from('brand_reseller_allocations')
          .select(`
            brand_id,
            brands_directory!inner(
              id,
              name,
              website_url,
              description,
              contact_email,
              logo_url,
              categories,
              is_active,
              department,
              approval_rate,
              response_time,
              created_at,
              updated_at
            )
          `)
          .eq('reseller_id', user.id);

        if (allocationsError) {
          console.error('useAvailableBrands: Error fetching brand allocations:', allocationsError);
          console.error('useAvailableBrands: Error details:', {
            message: allocationsError.message,
            code: allocationsError.code,
            details: allocationsError.details
          });
          throw allocationsError;
        }

        console.log('useAvailableBrands: Raw allocated brands data:', allocatedBrands);

        // Filter out null brands and only include active ones
        const activeBrands = allocatedBrands
          ?.filter(allocation => 
            allocation.brands_directory && 
            allocation.brands_directory.is_active
          )
          .map(allocation => allocation.brands_directory) || [];

        console.log('useAvailableBrands: Active allocated brands:', activeBrands);

        if (activeBrands.length === 0) {
          console.log('useAvailableBrands: No active brands allocated to user - this might be the issue!');
          return [];
        }

        // Get ALL applications for this reseller with follow-up data
        // Then filter client-side instead of using .in() which creates massive URLs
        const brandIds = activeBrands.map(brand => brand.id);
        console.log('useAvailableBrands: Brand IDs to filter by:', brandIds.length, 'brands');

        const { data: allApplications, error: appsError } = await supabase
          .from('brand_applications')
          .select(`
            brand_id, 
            status, 
            id, 
            created_at, 
            follow_up_count, 
            last_follow_up_at
          `)
          .eq('reseller_id', user.id);

        if (appsError) {
          console.error('useAvailableBrands: Error fetching applications:', appsError);
          throw appsError;
        }

        console.log('useAvailableBrands: Fetched all applications:', allApplications?.length || 0);

        // Filter applications to only include those for allocated brands
        const relevantApplications = allApplications?.filter(app => 
          brandIds.includes(app.brand_id)
        ) || [];

        console.log('useAvailableBrands: Relevant applications after filtering:', relevantApplications.length);

        // Map applications to brands
        const applicationMap = new Map(
          relevantApplications.map(app => [app.brand_id, app.status])
        );
        
        const applicationDataMap = new Map(
          relevantApplications.map(app => [app.brand_id, {
            id: app.id,
            created_at: app.created_at,
            follow_up_count: app.follow_up_count || 0,
            last_follow_up_at: app.last_follow_up_at,
            status: app.status,
          }])
        );

        const brandsWithStatus = activeBrands.map(brand => ({
          id: brand.id,
          name: brand.name,
          website_url: brand.website_url,
          description: brand.description,
          contact_email: brand.contact_email,
          logo_url: brand.logo_url,
          categories: brand.categories,
          is_active: brand.is_active,
          department: brand.department,
          approval_rate: brand.approval_rate,
          response_time: brand.response_time,
          created_at: brand.created_at,
          updated_at: brand.updated_at,
          applicationStatus: applicationMap.get(brand.id) || null,
          application: applicationDataMap.get(brand.id),
          // Helper properties for display
          displayName: brand.name,
          displayDepartment: brand.department,
        }));

        console.log('Final brands with application status:', brandsWithStatus);
        return brandsWithStatus;

      } catch (error) {
        console.error('useAvailableBrands: Error in useAvailableBrands:', error);
        console.error('useAvailableBrands: Full error object:', JSON.stringify(error, null, 2));
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};
