
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
      console.log('Fetching brands directory...');
      
      const { data, error } = await supabase.rpc('admin_get_brands' as any);
      
      if (error) {
        console.error('Error fetching brands via RPC:', error);
        // Fallback to direct query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Fallback error:', fallbackError);
          throw fallbackError;
        }
        console.log('Brands fetched via fallback:', fallbackData);
        return fallbackData as Brand[];
      }
      
      console.log('Brands fetched via RPC:', data);
      return data as Brand[];
    },
  });

  // Add brand mutation
  const addBrandMutation = useMutation({
    mutationFn: async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Adding brand with data:', brandData);
      
      const { data, error } = await supabase.rpc('admin_add_brand', {
        brand_data: {
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
        }
      });
      
      if (error) {
        console.error('Error adding brand:', error);
        throw error;
      }
      
      console.log('Brand added successfully:', data);
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
      console.error('Add brand error:', error);
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
      console.log('Updating brand with data:', brandData);
      
      const { data, error } = await supabase.rpc('admin_update_brand', {
        brand_id: brandData.id,
        brand_data: {
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
        }
      });
      
      if (error) {
        console.error('Error updating brand:', error);
        throw error;
      }
      
      console.log('Brand updated successfully:', data);
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
      console.error('Update brand error:', error);
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
      console.log('Toggling brand status:', { id, is_active });
      
      const { data, error } = await supabase.rpc('admin_update_brand', {
        brand_id: id,
        brand_data: {
          is_active,
          updated_at: new Date().toISOString()
        }
      });
      
      if (error) {
        console.error('Error toggling brand status:', error);
        throw error;
      }
      
      console.log('Brand status toggled successfully:', data);
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
      console.error('Toggle status error:', error);
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
      console.log('Deleting brand:', brandId);
      
      const { data, error } = await supabase.rpc('admin_delete_brand', {
        p_brand_id: brandId
      });
      
      if (error) {
        console.error('Error deleting brand:', error);
        throw error;
      }
      
      console.log('Brand deleted successfully:', data);
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
      console.error('Delete brand error:', error);
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
