
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Brand, BrandFormData } from './types';

export const useBrands = () => {
  const queryClient = useQueryClient();

  // Fetch brands - use service role for admin access
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands-directory'],
    queryFn: async () => {
      console.log('Fetching brands...');
      
      // For admin portal, we need to use a different approach since auth is bypassed
      // We'll use the RPC function for admin access
      const { data, error } = await supabase.rpc('admin_get_brands' as any);
      
      if (error) {
        console.error('Error fetching brands via RPC:', error);
        // Fallback to direct query without RLS
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          console.error('Fallback error:', fallbackError);
          throw fallbackError;
        }
        return fallbackData as Brand[];
      }
      
      console.log('Brands fetched successfully:', data);
      return data as Brand[];
    },
  });

  // Add brand mutation - use RPC function for admin operations
  const addBrandMutation = useMutation({
    mutationFn: async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Adding brand with data:', brandData);
      
      const { data, error } = await supabase.rpc('admin_add_brand' as any, {
        brand_data: {
          ...brandData,
          categories: Array.isArray(brandData.categories) 
            ? brandData.categories 
            : []
        }
      });
      
      if (error) {
        console.error('RPC error:', error);
        throw error;
      }
      
      console.log('Brand added successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      toast({
        title: 'Brand Added',
        description: 'Brand has been successfully added to the directory.',
      });
    },
    onError: (error) => {
      console.error('Add brand mutation error:', error);
      toast({
        title: 'Error',
        description: `Failed to add brand: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: async ({ id, ...brandData }: Partial<Brand> & { id: string }) => {
      const { data, error } = await supabase.rpc('admin_update_brand' as any, {
        brand_id: id,
        brand_data: {
          ...brandData,
          updated_at: new Date().toISOString()
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      toast({
        title: 'Brand Updated',
        description: 'Brand has been successfully updated.',
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

  // Toggle brand status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase.rpc('admin_update_brand' as any, {
        brand_id: id,
        brand_data: { 
          is_active, 
          updated_at: new Date().toISOString() 
        }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      toast({
        title: 'Status Updated',
        description: 'Brand status has been updated.',
      });
    },
  });

  // Delete brand mutation
  const deleteBrandMutation = useMutation({
    mutationFn: async (brandId: string) => {
      const { data, error } = await supabase.rpc('admin_delete_brand', {
        brand_id: brandId
      });
      
      if (error) throw error;
      if (!data) throw new Error('Failed to delete brand');
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands-directory'] });
      toast({
        title: 'Brand Deleted',
        description: 'Brand has been successfully deleted.',
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
    addBrandMutation,
    updateBrandMutation,
    toggleStatusMutation,
    deleteBrandMutation,
  };
};
