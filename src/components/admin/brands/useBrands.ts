import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Brand } from './types';

export const useBrands = () => {
  const queryClient = useQueryClient();

  // Fetch brands
  const {
    data: brands = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['brands-directory'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_brands' as any);
      
      if (error) {
        // Fallback to direct query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          throw fallbackError;
        }
        return fallbackData as Brand[];
      }
      
      return data as Brand[];
    },
  });

  // Add brand mutation
  const addBrandMutation = useMutation({
    mutationFn: async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
      // Prepare the brand data object with all fields
      const brandPayload = {
        name: brandData.name,
        website_url: brandData.website_url,
        description: brandData.description,
        contact_email: brandData.contact_email,
        logo_url: brandData.logo_url,
        categories: brandData.categories,
        approval_rate: brandData.approval_rate,
        response_time: brandData.response_time,
        department: brandData.department, // Ensure department is included
        is_active: brandData.is_active
      };
      
      const { data, error } = await supabase.rpc('admin_add_brand', {
        brand_data: brandPayload
      });
      
      if (error) {
        // Fallback to direct insert
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .insert([brandPayload])
          .select()
          .single();
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        return fallbackData;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      toast({
        title: 'Brand Added',
        description: 'Brand has been added successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add brand: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: async (brandData: Partial<Brand> & { id: string }) => {
      const updatePayload = {
        name: brandData.name,
        website_url: brandData.website_url,
        description: brandData.description,
        contact_email: brandData.contact_email,
        logo_url: brandData.logo_url,
        categories: brandData.categories,
        approval_rate: brandData.approval_rate,
        response_time: brandData.response_time,
        department: brandData.department, // Ensure department is included
        is_active: brandData.is_active,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase.rpc('admin_update_brand', {
        brand_id: brandData.id,
        brand_data: updatePayload
      });
      
      if (error) {
        // Fallback to direct update
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .update(updatePayload)
          .eq('id', brandData.id)
          .select()
          .single();
        
        if (fallbackError) {
          throw fallbackError;
        }
        
        return fallbackData;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      toast({
        title: 'Brand Updated',
        description: 'Brand has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update brand: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase.rpc('admin_update_brand', {
        brand_id: id,
        brand_data: {
          is_active,
          updated_at: new Date().toISOString()
        }
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      toast({
        title: 'Status Updated',
        description: 'Brand status has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete brand mutation
  const deleteBrandMutation = useMutation({
    mutationFn: async (brandId: string) => {
      const { data, error } = await supabase.rpc('admin_delete_brand', {
        p_brand_id: brandId
      });
      
      if (error) {
        // Fallback to direct delete
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .delete()
          .eq('id', brandId)
          .select();
          
        if (fallbackError) {
          throw fallbackError;
        }
        
        return fallbackData;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      toast({
        title: 'Brand Deleted',
        description: 'Brand has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete brand: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    brands,
    isLoading,
    error,
    addBrandMutation,
    updateBrandMutation,
    toggleStatusMutation,
    deleteBrandMutation,
  };
};