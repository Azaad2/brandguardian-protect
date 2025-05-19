
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
    
    // Get unique brand_ids from orders where the user is the reseller
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('brand_id, created_at')
      .eq('reseller_id', user.id)
      .order('created_at', { ascending: false });
    
    if (orderError) throw orderError;
    
    // Get unique brands
    const brandIds = [...new Set(orderData.map(order => order.brand_id))];
    
    if (brandIds.length === 0) return [];
    
    // Get brand details from profiles table
    const { data: brandProfiles, error: brandError } = await supabase
      .from('profiles')
      .select('id, company_name, user_role')
      .in('id', brandIds)
      .eq('user_role', 'brand');
    
    if (brandError) throw brandError;
    
    // For each brand, get products count and last order date
    const brandsWithDetails = await Promise.all(
      brandProfiles.map(async (brand) => {
        // Get products count
        const { count: productsCount, error: productError } = await supabase
          .from('products')
          .select('id', { count: 'exact' })
          .eq('brand_id', brand.id);
        
        if (productError) throw productError;
        
        // Get last order date
        const brandOrders = orderData.filter(order => order.brand_id === brand.id);
        const lastOrderDate = brandOrders.length > 0 
          ? new Date(brandOrders[0].created_at).toISOString().split('T')[0]
          : '-';
          
        // Get minimum order value from products
        const { data: productMinOrder, error: minOrderError } = await supabase
          .from('products')
          .select('wholesale_price')
          .eq('brand_id', brand.id)
          .order('wholesale_price', { ascending: true })
          .limit(1);
          
        const minOrder = productMinOrder && productMinOrder.length > 0
          ? `$${(productMinOrder[0].wholesale_price * 5).toFixed(2)}`
          : '$1,000';
          
        // Assign a random category for now (in a real app, this would come from the brand's profile)
        const categories = ['Electronics', 'Home & Garden', 'Apparel', 'Beauty & Personal Care'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        return {
          name: brand.company_name || 'Unknown Brand',
          category: randomCategory,
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
  
  // Set up realtime subscription for products and orders
  useEffect(() => {
    if (!user) return;
    
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
