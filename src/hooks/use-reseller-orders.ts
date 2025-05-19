
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export type Order = {
  id: string;
  brandName: string;
  date: string;
  total: string;
  status: string;
  items: number;
};

export const useResellerOrders = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const fetchOrders = async () => {
    if (!user) throw new Error('User not authenticated');
    
    // Fetch orders joined with brand information
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        brand_id,
        profiles!brand_id (company_name)
      `)
      .eq('reseller_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;

    // Get order items count for each order
    const ordersWithItemCount = await Promise.all(
      data.map(async (order) => {
        const { count, error: countError } = await supabase
          .from('order_items')
          .select('id', { count: 'exact' })
          .eq('order_id', order.id);
          
        if (countError) throw countError;
        
        return {
          id: order.id,
          brandName: order.profiles?.company_name || 'Unknown Brand',
          date: new Date(order.created_at).toISOString().split('T')[0],
          total: `$${order.total_amount.toFixed(2)}`,
          status: order.status,
          items: count || 0
        };
      })
    );
    
    return ordersWithItemCount;
  };
  
  const {
    data: orders,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['resellerOrders', user?.id],
    queryFn: fetchOrders,
    enabled: !!user,
    staleTime: 30000 // 30 seconds
  });
  
  // Set up realtime subscription when component mounts
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `reseller_id=eq.${user.id}`
      }, () => {
        // When any change happens to orders, refetch data
        refetch();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
  
  return {
    orders: orders || [],
    isLoading,
    isError,
    error,
    refetch
  };
};
