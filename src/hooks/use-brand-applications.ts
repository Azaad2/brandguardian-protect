
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
  brand?: {
    name: string;
    website_url: string | null;
    description: string | null;
    contact_email: string;
    logo_url: string | null;
    categories: string[] | null;
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
            categories
          )
        `)
        .eq('reseller_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BrandApplication[];
    },
    enabled: !!user,
  });

  // Apply to brand mutation
  const applyToBrandMutation = useMutation({
    mutationFn: async ({ brandId, applicationData }: { brandId: string; applicationData?: any }) => {
      if (!user) throw new Error('User not authenticated');

      // Generate unique email thread ID
      const emailThreadId = `app_${brandId}_${user.id}_${Date.now()}`;

      const { data, error } = await supabase
        .from('brand_applications')
        .insert([{
          reseller_id: user.id,
          brand_id: brandId,
          email_thread_id: emailThreadId,
          application_data: applicationData || {},
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
            categories
          )
        `)
        .single();
      
      if (error) throw error;

      // Send email notification to brand
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

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-applications'] });
      toast({
        title: 'Application Submitted!',
        description: 'Your application has been sent to the brand. You will receive updates in your messages.',
      });
    },
    onError: (error) => {
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
  };
};

export const useAvailableBrands = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['available-brands', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Get all active brands
      const { data: brands, error: brandsError } = await supabase
        .from('brands_directory')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (brandsError) throw brandsError;

      // Get user's applications
      const { data: applications, error: appsError } = await supabase
        .from('brand_applications')
        .select('brand_id, status')
        .eq('reseller_id', user.id);

      if (appsError) throw appsError;

      // Map applications to brands
      const applicationMap = new Map(
        applications.map(app => [app.brand_id, app.status])
      );

      return brands.map(brand => ({
        ...brand,
        applicationStatus: applicationMap.get(brand.id) || null,
      }));
    },
    enabled: !!user,
  });
};
