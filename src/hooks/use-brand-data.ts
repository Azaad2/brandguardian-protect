import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './use-auth';

// Hook for fetching brand orders
export const useBrandOrders = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // First get orders for this brand
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });
      
      if (ordersError) throw ordersError;
      
      if (!orders || orders.length === 0) return [];
      
      // Get unique reseller IDs
      const resellerIds = [...new Set(orders.map(order => order.reseller_id))];
      
      // Fetch reseller profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name')
        .in('id', resellerIds);
      
      if (profilesError) throw profilesError;
      
      // Combine orders with reseller data
      const ordersWithResellers = orders.map(order => ({
        ...order,
        reseller: profiles?.find(profile => profile.id === order.reseller_id) || null
      }));
      
      return ordersWithResellers;
    },
    enabled: !!user?.id,
  });
};

// Hook for fetching brand messages
export const useBrandMessages = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-messages', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // First get messages for this brand
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });
      
      if (messagesError) throw messagesError;
      
      if (!messages || messages.length === 0) return [];
      
      // Get unique sender IDs
      const senderIds = [...new Set(messages.map(message => message.sender_id))];
      
      // Fetch sender profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name')
        .in('id', senderIds);
      
      if (profilesError) throw profilesError;
      
      // Combine messages with sender data
      const messagesWithSenders = messages.map(message => ({
        ...message,
        sender: profiles?.find(profile => profile.id === message.sender_id) || null
      }));
      
      return messagesWithSenders;
    },
    enabled: !!user?.id,
  });
};

// Hook for fetching brand resellers
export const useBrandResellers = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-resellers', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // First get the brand from brands_directory for this user
      const { data: brandData, error: brandError } = await supabase
        .from('brands_directory')
        .select('id, name')
        .eq('contact_email', user.email)
        .maybeSingle();
      
      if (brandError || !brandData) {
        // If no brand found, return empty array
        return [];
      }
      
      // Get allocations for this brand
      const { data: allocations, error: allocationsError } = await supabase
        .from('brand_reseller_allocations')
        .select('*')
        .eq('brand_id', brandData.id);
      
      if (allocationsError) throw allocationsError;
      
      if (!allocations || allocations.length === 0) return [];
      
      // Get unique reseller IDs
      const resellerIds = [...new Set(allocations.map(allocation => allocation.reseller_id))];
      
      // Fetch reseller profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name, created_at')
        .in('id', resellerIds);
      
      if (profilesError) throw profilesError;
      
      // Combine allocations with reseller data
      const allocationsWithResellers = allocations.map(allocation => ({
        ...allocation,
        reseller: profiles?.find(profile => profile.id === allocation.reseller_id) || null,
        brand: { name: brandData.name }
      }));
      
      return allocationsWithResellers;
    },
    enabled: !!user?.id,
  });
};

// Hook for fetching brand products
export const useBrandProducts = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-products', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });
};

// Hook for fetching brand subscription
export const useBrandSubscription = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
};

// Hook for fetching brand applications
export const useBrandApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // First get the brand from brands_directory for this user
      const { data: brandData, error: brandError } = await supabase
        .from('brands_directory')
        .select('id')
        .eq('contact_email', user.email)
        .maybeSingle();
      
      if (brandError || !brandData) {
        return [];
      }
      
      // Get applications for this brand
      const { data: applications, error: applicationsError } = await supabase
        .from('brand_applications')
        .select('*')
        .eq('brand_id', brandData.id)
        .order('created_at', { ascending: false });
      
      if (applicationsError) throw applicationsError;
      
      if (!applications || applications.length === 0) return [];
      
      // Get unique reseller IDs
      const resellerIds = [...new Set(applications.map(app => app.reseller_id))];
      
      // Fetch reseller profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, company_name')
        .in('id', resellerIds);
      
      if (profilesError) throw profilesError;
      
      // Combine applications with reseller data
      const applicationsWithResellers = applications.map(application => ({
        ...application,
        reseller: profiles?.find(profile => profile.id === application.reseller_id) || null
      }));
      
      return applicationsWithResellers;
    },
    enabled: !!user?.id,
  });
};

// Hook for fetching brand analytics
export const useBrandAnalytics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['brand-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Get orders count and revenue
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total_amount, status')
        .eq('brand_id', user.id);
      
      if (ordersError) throw ordersError;
      
      // Get resellers count
      const { data: brandData } = await supabase
        .from('brands_directory')
        .select('id')
        .eq('contact_email', user.email)
        .single();
      
      let resellersCount = 0;
      if (brandData) {
        const { count } = await supabase
          .from('brand_reseller_allocations')
          .select('id', { count: 'exact' })
          .eq('brand_id', brandData.id);
        resellersCount = count || 0;
      }
      
      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('brand_id', user.id);
      
      // Calculate metrics
      const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
      const ordersCount = orders?.length || 0;
      
      return {
        totalRevenue,
        ordersCount,
        resellersCount,
        productsCount: productsCount || 0,
        orders: orders || []
      };
    },
    enabled: !!user?.id,
  });
};