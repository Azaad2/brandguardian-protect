
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Brand, BrandFormData } from './types';

export const useBrands = () => {
  const queryClient = useQueryClient();

  // Fetch brands
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ['brands-directory'],
    queryFn: async () => {
      console.log('Fetching brands...');
      const { data, error } = await supabase
        .from('brands_directory')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      console.log('Brands fetched successfully:', data);
      return data as Brand[];
    },
  });

  // Add brand mutation
  const addBrandMutation = useMutation({
    mutationFn: async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Adding brand with data:', brandData);
      
      // Check current user and session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', user);
      console.log('User error:', userError);
      
      if (!user) {
        throw new Error('No authenticated user found');
      }
      
      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();
      
      console.log('User profile:', profile);
      console.log('Profile error:', profileError);
      
      if (profile?.user_role !== 'admin') {
        throw new Error(`User role is ${profile?.user_role}, but admin role is required`);
      }
      
      const { data, error } = await supabase
        .from('brands_directory')
        .insert([{
          ...brandData,
          categories: Array.isArray(brandData.categories) 
            ? brandData.categories 
            : []
        }])
        .select()
        .single();
      
      console.log('Insert result:', { data, error });
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('brands_directory')
        .update({
          ...brandData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
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
      const { data, error } = await supabase
        .from('brands_directory')
        .update({ is_active, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
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

  return {
    brands,
    isLoading,
    addBrandMutation,
    updateBrandMutation,
    toggleStatusMutation,
  };
};
