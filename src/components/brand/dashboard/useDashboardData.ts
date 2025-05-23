
import { useState } from 'react';

export interface DashboardData {
  resellers: {
    authorized: number;
    pending: number;
    growth: number;
  };
  listings: {
    active: number;
    unauthorized: number;
    mostListed: string;
  };
  compliance: {
    mapViolations: number;
    contentIssues: number;
    resolvedIssues: number;
  };
  sales: {
    totalRevenue: number;
    topReseller: string;
    growthRate: number;
  };
}

export type TimeRange = '7d' | '30d' | '90d';

export const useDashboardData = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Sample data - in a real app, this would come from an API
  const dashboardData: DashboardData = {
    resellers: {
      authorized: 48,
      pending: 12,
      growth: 8.5,
    },
    listings: {
      active: 245,
      unauthorized: 17,
      mostListed: 'Premium Skincare Collection',
    },
    compliance: {
      mapViolations: 8,
      contentIssues: 5,
      resolvedIssues: 12,
    },
    sales: {
      totalRevenue: 125750,
      topReseller: 'Metro Wholesale',
      growthRate: 12.3,
    },
  };

  // Chart data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Revenue',
        data: [65000, 72000, 86000, 92000, 105000, 125750],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 2,
      },
    ],
  };

  const marketplaceData = {
    labels: ['Amazon', 'Walmart', 'eBay', 'Shopify', 'Other'],
    datasets: [
      {
        label: 'Sales Distribution',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(37, 99, 235, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(234, 88, 12, 0.7)',
          'rgba(168, 85, 247, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const complianceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'MAP Violations',
        data: [14, 12, 10, 9, 7, 8],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
      },
      {
        label: 'Resolved Issues',
        data: [5, 7, 9, 8, 10, 12],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  return {
    timeRange,
    setTimeRange,
    dashboardData,
    revenueData,
    marketplaceData,
    complianceData,
  };
};
