
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export type AnalyticsData = {
  totalSales: number;
  orderCount: number;
  averageOrderValue: number;
  brandCount: number;
  pendingApprovals: number;
  profitMargin: number;
  salesData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
  brandPerformanceData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
    }[];
  };
  marginTrendData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      borderDash?: number[];
    }[];
  };
};

export const useResellerAnalytics = (timeRange: '3m' | '6m' | '1y' = '3m') => {
  const { user } = useAuth();
  
  const fetchAnalytics = async () => {
    if (!user) throw new Error('User not authenticated');
    
    // Calculate date range based on timeRange
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '3m':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    const startDateStr = startDate.toISOString();
    
    // Fetch orders within the date range
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id, total_amount, created_at, brand_id')
      .eq('reseller_id', user.id)
      .gte('created_at', startDateStr)
      .order('created_at', { ascending: true });
    
    if (ordersError) throw ordersError;
    
    // Get count of unique brands
    const uniqueBrandIds = [...new Set(orders.map(order => order.brand_id))];
    
    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + order.total_amount, 0);
    
    // Calculate average order value
    const averageOrderValue = orders.length > 0 ? Math.round(totalSales / orders.length) : 0;
    
    // Get pending brand approvals
    const { count: pendingApprovals, error: pendingError } = await supabase
      .from('reseller_applications')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('status', 'pending');
    
    if (pendingError) throw pendingError;
    
    // Generate month labels based on timeRange
    const monthLabels = generateMonthLabels(timeRange);
    
    // Group orders by month for sales data
    const monthlyOrderData = groupOrdersByMonth(orders, timeRange);
    
    // Generate datasets for different marketplaces (simulated data)
    // In a real implementation, this would come from actual marketplace data
    const amazonData = monthlyOrderData.map(amount => amount * 0.6);
    const walmartData = monthlyOrderData.map(amount => amount * 0.25);
    const ebayData = monthlyOrderData.map(amount => amount * 0.15);
    
    // Get top performing brands
    const brandPerformance = getBrandPerformance(orders, uniqueBrandIds);
    
    // Generate margin trend data (simulated)
    const marginTrend = generateMarginTrendData(timeRange);
    
    return {
      totalSales,
      orderCount: orders.length,
      averageOrderValue,
      brandCount: uniqueBrandIds.length,
      pendingApprovals: pendingApprovals || 0,
      profitMargin: 23.5, // Fixed for now, would be calculated from actual data
      
      // Sales data by marketplace
      salesData: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Amazon Sales',
            data: amazonData,
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
          },
          {
            label: 'Walmart Sales',
            data: walmartData,
            backgroundColor: 'rgba(249, 115, 22, 0.7)',
          },
          {
            label: 'eBay Sales',
            data: ebayData,
            backgroundColor: 'rgba(236, 72, 153, 0.7)',
          }
        ]
      },
      
      // Brand performance data
      brandPerformanceData: {
        labels: brandPerformance.labels,
        datasets: [{
          label: 'Sales by Brand',
          data: brandPerformance.data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(236, 72, 153, 0.7)',
            'rgba(139, 92, 246, 0.7)'
          ]
        }]
      },
      
      // Margin trend data
      marginTrendData: marginTrend
    };
  };
  
  // Helper function to generate month labels
  const generateMonthLabels = (timeRange: '3m' | '6m' | '1y'): string[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();
    let monthCount: number;
    
    switch (timeRange) {
      case '3m':
        monthCount = 3;
        break;
      case '6m':
        monthCount = 6;
        break;
      case '1y':
        monthCount = 12;
        break;
    }
    
    const labels = [];
    for (let i = monthCount - 1; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      labels.push(months[monthIndex]);
    }
    
    return labels;
  };
  
  // Helper function to group orders by month
  const groupOrdersByMonth = (orders: any[], timeRange: '3m' | '6m' | '1y'): number[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();
    let monthCount: number;
    
    switch (timeRange) {
      case '3m':
        monthCount = 3;
        break;
      case '6m':
        monthCount = 6;
        break;
      case '1y':
        monthCount = 12;
        break;
    }
    
    const monthlyData = Array(monthCount).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.created_at);
      const orderMonth = orderDate.getMonth();
      const monthsAgo = (currentMonth - orderMonth + 12) % 12;
      
      if (monthsAgo < monthCount) {
        monthlyData[monthCount - 1 - monthsAgo] += order.total_amount;
      }
    });
    
    return monthlyData;
  };
  
  // Helper function to generate brand performance data
  const getBrandPerformance = (orders: any[], brandIds: string[]) => {
    // Group orders by brand and sum totals
    const brandTotals: {[key: string]: number} = {};
    const brandNames: {[key: string]: string} = {};
    
    // Initialize with brand IDs
    brandIds.forEach(id => {
      brandTotals[id] = 0;
      brandNames[id] = `Brand ${id.substring(0, 4)}`; // Placeholder names
    });
    
    // Sum order totals by brand
    orders.forEach(order => {
      if (brandTotals[order.brand_id] !== undefined) {
        brandTotals[order.brand_id] += order.total_amount;
      }
    });
    
    // Sort brands by total and take top 5
    const sortedBrands = Object.entries(brandTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    // Format for chart
    return {
      labels: sortedBrands.map(([id]) => brandNames[id]),
      data: sortedBrands.map(([, total]) => total)
    };
  };
  
  // Helper function to generate margin trend data
  const generateMarginTrendData = (timeRange: '3m' | '6m' | '1y') => {
    const monthLabels = generateMonthLabels(timeRange);
    let marginData: number[];
    
    // Simulated margin data
    switch (timeRange) {
      case '3m':
        marginData = [22, 24, 23.5];
        break;
      case '6m':
        marginData = [19, 20, 21, 22, 24, 23.5];
        break;
      case '1y':
        marginData = [18, 18.5, 19, 19.5, 20, 21, 21.5, 22, 22.5, 23, 24, 23.5];
        break;
    }
    
    return {
      labels: monthLabels,
      datasets: [
        {
          label: 'Average Margin %',
          data: marginData,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          tension: 0.3
        },
        {
          label: 'Industry Average',
          data: Array(monthLabels.length).fill(19),
          borderColor: 'rgb(148, 163, 184)',
          backgroundColor: 'rgba(148, 163, 184, 0.2)',
          borderDash: [5, 5],
          tension: 0.1
        }
      ]
    };
  };
  
  const {
    data: analytics,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['resellerAnalytics', user?.id, timeRange],
    queryFn: fetchAnalytics,
    enabled: !!user,
    staleTime: 60000 // 1 minute
  });
  
  // Set up realtime subscription for orders
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('orders-analytics-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `reseller_id=eq.${user.id}`
      }, () => {
        refetch();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refetch]);
  
  return {
    analytics: analytics || {
      totalSales: 0,
      orderCount: 0,
      averageOrderValue: 0,
      brandCount: 0,
      pendingApprovals: 0,
      profitMargin: 0,
      salesData: { labels: [], datasets: [] },
      brandPerformanceData: { labels: [], datasets: [] },
      marginTrendData: { labels: [], datasets: [] }
    },
    isLoading,
    isError,
    error,
    refetch
  };
};
