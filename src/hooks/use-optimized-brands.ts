import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useMemo, useDeferredValue, useState, useCallback, useEffect } from 'react';

export interface OptimizedBrand {
  id: string;
  name: string;
  website_url: string | null;
  description: string | null;
  contact_email: string;
  logo_url: string | null;
  categories: string[] | null;
  is_active: boolean;
  department: string | null;
  approval_rate: number | null;
  response_time: number | null;
  created_at: string;
  updated_at: string;
  application_status: string | null;
  application_id: string | null;
  application_created_at: string | null;
  follow_up_count: number;
  last_follow_up_at: string | null;
  response_expected_by: string | null;
}

export interface BrandFilters {
  searchQuery: string;
  applicationStatus: string[];
  followUpActions: string[];
  timeFilters: string[];
}

const BRANDS_CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const BRANDS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const useOptimizedBrands = (
  filters: BrandFilters = {
    searchQuery: '',
    applicationStatus: [],
    followUpActions: [],
    timeFilters: []
  },
  limit = 50,
  offset = 0
) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Defer filter values to prevent excessive re-renders
  const deferredFilters = useDeferredValue(filters);
  
  // Convert empty arrays to null for the RPC function
  const optimizedFilters = useMemo(() => ({
    searchQuery: deferredFilters.searchQuery || null,
    applicationStatus: deferredFilters.applicationStatus.length > 0 ? deferredFilters.applicationStatus : null,
    followUpActions: deferredFilters.followUpActions.length > 0 ? deferredFilters.followUpActions : null,
    timeFilters: deferredFilters.timeFilters.length > 0 ? deferredFilters.timeFilters : null,
  }), [deferredFilters]);

  const query = useQuery({
    queryKey: ['optimized-brands', user?.id, optimizedFilters, limit, offset],
    queryFn: async (): Promise<OptimizedBrand[]> => {
      if (!user) return [];

      console.log('🚀 Fetching optimized brands with filters:', optimizedFilters);
      const startTime = performance.now();

      const { data, error } = await supabase
        .rpc('get_reseller_brands_optimized', {
          p_reseller_id: user.id,
          p_search_query: optimizedFilters.searchQuery,
          p_application_status: optimizedFilters.applicationStatus,
          p_follow_up_filters: optimizedFilters.followUpActions,
          p_time_filters: optimizedFilters.timeFilters,
          p_limit: limit,
          p_offset: offset
        });

      const duration = performance.now() - startTime;
      console.log(`✅ Brands fetched in ${duration.toFixed(2)}ms`);

      if (error) {
        console.error('❌ Error fetching optimized brands:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
    staleTime: 5000, // Consider data fresh for 5 seconds (reduced for faster updates)
    gcTime: 2 * 60 * 1000, // Keep unused data in cache for 2 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: 'always', // ALWAYS fetch fresh data when component mounts
    refetchInterval: 10000, // Auto-refetch every 10 seconds (increased frequency)
  });

  // Log hook usage for debugging
  console.log('🔍 useOptimizedBrands called:', {
    userId: user?.id,
    filters: optimizedFilters,
    limit,
    offset,
    brandsCount: query.data?.length || 0,
    isLoading: query.isLoading,
    error: query.error?.message,
  });

  // Optimistic count query for total brands (cached separately)
  const countQuery = useQuery({
    queryKey: ['optimized-brands-count', user?.id, optimizedFilters],
    queryFn: async (): Promise<number> => {
      if (!user) return 0;

      const { data, error } = await supabase
        .rpc('get_reseller_brands_count', {
          p_reseller_id: user.id,
          p_search_query: optimizedFilters.searchQuery,
          p_application_status: optimizedFilters.applicationStatus,
          p_follow_up_filters: optimizedFilters.followUpActions,
          p_time_filters: optimizedFilters.timeFilters
        });

      if (error) throw error;
      return data || 0;
    },
    enabled: !!user,
    staleTime: 5000, // Consider data fresh for 5 seconds
    gcTime: 2 * 60 * 1000, // Keep unused data in cache for 2 minutes
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: 'always', // ALWAYS fetch fresh data
    refetchInterval: 10000, // Auto-refetch every 10 seconds
  });

  // Real-time subscription for brand allocations
  useEffect(() => {
    if (!user) {
      console.log('⚠️ No user found, skipping realtime subscription');
      return;
    }

    console.log('🔄 Setting up realtime subscription for brand allocations', {
      userId: user.id,
      email: user.email,
    });

    const channel = supabase
      .channel('brand-allocations-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'brand_reseller_allocations',
          filter: `reseller_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🔔 Brand allocation changed:', {
            eventType: payload.eventType,
            new: payload.new,
            old: payload.old,
          });
          
          // Invalidate all brand-related queries to trigger immediate refetch
          queryClient.invalidateQueries({ queryKey: ['optimized-brands', user.id] });
          queryClient.invalidateQueries({ queryKey: ['optimized-brands-count', user.id] });
          
          console.log('✨ Brand list updated in real-time - queries invalidated');
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Prefetch next page for smooth scrolling
  const prefetchNextPage = () => {
    if (query.data && query.data.length === limit) {
      queryClient.prefetchQuery({
        queryKey: ['optimized-brands', user?.id, optimizedFilters, limit, offset + limit],
        queryFn: async () => {
          if (!user) return [];
          
          const { data, error } = await supabase
            .rpc('get_reseller_brands_optimized', {
              p_reseller_id: user.id,
              p_search_query: optimizedFilters.searchQuery,
              p_application_status: optimizedFilters.applicationStatus,
              p_follow_up_filters: optimizedFilters.followUpActions,
              p_time_filters: optimizedFilters.timeFilters,
              p_limit: limit,
              p_offset: offset + limit
            });

          if (error) throw error;
          return data || [];
        },
        staleTime: BRANDS_STALE_TIME,
      });
    }
  };

  const result = {
    brands: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    totalCount: countQuery.data || 0,
    isCountLoading: countQuery.isLoading,
    refetch: query.refetch,
    prefetchNextPage,
    hasNextPage: query.data?.length === limit,
    isFetching: query.isFetching,
    isStale: query.isStale,
  };

  console.log('📊 useOptimizedBrands returning:', {
    brandsCount: result.brands.length,
    totalCount: result.totalCount,
    isLoading: result.isLoading,
    hasError: !!result.error,
  });

  return result;
};

// Hook for infinite loading
export const useInfiniteBrands = (filters: BrandFilters) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [allBrands, setAllBrands] = useState<OptimizedBrand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  
  const BATCH_SIZE = 25;

  const loadMoreBrands = useCallback(async () => {
    if (!user || isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('get_reseller_brands_optimized', {
          p_reseller_id: user.id,
          p_search_query: filters.searchQuery || null,
          p_application_status: filters.applicationStatus.length > 0 ? filters.applicationStatus : null,
          p_follow_up_filters: filters.followUpActions.length > 0 ? filters.followUpActions : null,
          p_time_filters: filters.timeFilters.length > 0 ? filters.timeFilters : null,
          p_limit: BATCH_SIZE,
          p_offset: offset
        });

      if (error) throw error;

      const newBrands = data || [];
      
      if (offset === 0) {
        setAllBrands(newBrands);
      } else {
        setAllBrands(prev => [...prev, ...newBrands]);
      }
      
      setHasMore(newBrands.length === BATCH_SIZE);
      setOffset(prev => prev + BATCH_SIZE);
    } catch (error) {
      console.error('Error loading more brands:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, filters, offset, isLoading, hasMore]);

  // Reset when filters change
  useEffect(() => {
    setAllBrands([]);
    setOffset(0);
    setHasMore(true);
    loadMoreBrands();
  }, [filters.searchQuery, filters.applicationStatus, filters.followUpActions, filters.timeFilters]);

  // Real-time subscription for brand allocations (infinite loading)
  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up realtime subscription for infinite brands');

    const channel = supabase
      .channel('infinite-brand-allocations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'brand_reseller_allocations',
          filter: `reseller_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('🔔 Brand allocation changed (infinite):', payload);
          
          // Reset and reload when allocations change
          setAllBrands([]);
          setOffset(0);
          setHasMore(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    brands: allBrands,
    isLoading,
    hasMore,
    loadMore: loadMoreBrands,
  };
};