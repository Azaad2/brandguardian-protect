
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export type Brand = {
  name: string;
  category: string;
  status: string;
  productsCount: number;
  minOrder: string;
  lastOrder: string;
};

export const useResellerBrands = () => {
  const { user } = useAuth();
  
  const fetchBrands = async () => {
    if (!user) throw new Error('User not authenticated');
    
    // Get allocated brands for this reseller
    const { data: allocatedBrands, error: allocationError } = await supabase
      .from('brand_reseller_allocations')
      .select(`
        brand_id,
        allocated_at,
        brands_directory!inner(
          id,
          name,
          contact_email,
          categories,
          department
        )
      `)
      .eq('reseller_id', user.id);
    
    if (allocationError) throw allocationError;
    
    if (!allocatedBrands || allocatedBrands.length === 0) return [];
    
    // Transform allocated brands data
    const brandsWithDetails = await Promise.all(
      allocatedBrands.map(async (allocation) => {
        const brand = allocation.brands_directory;
        
        // Get products count
        const { count: productsCount, error: productError } = await supabase
          .from('products')
          .select('id', { count: 'exact' })
          .eq('brand_id', allocation.brand_id);
        
        if (productError) throw productError;
        
        // Get last order date for this brand and reseller
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('created_at')
          .eq('reseller_id', user.id)
          .eq('brand_id', allocation.brand_id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const lastOrderDate = orderData && orderData.length > 0
          ? new Date(orderData[0].created_at).toISOString().split('T')[0]
          : '-';
          
        // Get minimum order value from products
        const { data: productMinOrder, error: minOrderError } = await supabase
          .from('products')
          .select('wholesale_price')
          .eq('brand_id', allocation.brand_id)
          .order('wholesale_price', { ascending: true })
          .limit(1);
          
        const minOrder = productMinOrder && productMinOrder.length > 0
          ? `$${(productMinOrder[0].wholesale_price * 5).toFixed(2)}`
          : '$1,000';
          
        // Use brand categories or assign a default
        const category = brand.categories && brand.categories.length > 0 
          ? brand.categories[0] 
          : brand.department || 'General';
        
        return {
          name: brand.name || 'Unknown Brand',
          category: category,
          status: 'Approved',
          productsCount: productsCount || 0,
          minOrder: minOrder,
          lastOrder: lastOrderDate
        };
      })
    );
    
    return brandsWithDetails;
  };
  
  const {
    data: brands,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['resellerBrands', user?.id],
    queryFn: fetchBrands,
    enabled: !!user,
    staleTime: 60000 // 1 minute
  });
  
  // Set up realtime subscription for brand allocations, products and orders
  useEffect(() => {
    if (!user) return;
    
    const allocationsChannel = supabase
      .channel('brand-allocations-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'brand_reseller_allocations',
        filter: `reseller_id=eq.${user.id}`
      }, () => {
        refetch();
      })
      .subscribe();
    
    const ordersChannel = supabase
      .channel('orders-brand-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `reseller_id=eq.${user.id}`
      }, () => {
        refetch();
      })
      .subscribe();
    
    const productsChannel = supabase
      .channel('products-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, () => {
        refetch();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(allocationsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(productsChannel);
    };
  }, [user, refetch]);
  
  return {
    brands: brands || [],
    isLoading,
    isError,
    error,
    refetch
  };
};
