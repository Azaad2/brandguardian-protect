
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuickStatsCards from './dashboard/QuickStatsCards';
import SalesCharts from './dashboard/SalesCharts';
import ComplianceChart from './dashboard/ComplianceChart';
import RecentActivities from './dashboard/RecentActivities';
import PendingApplications from './dashboard/PendingApplications';
import { useBrandAnalytics } from "@/hooks/use-brand-data";
import { useState } from 'react';

export type TimeRange = '7d' | '30d' | '90d';

const BrandOverview = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const { data: analytics, isLoading, error } = useBrandAnalytics();

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // In a real app, this would trigger a data reload with date filtering
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          <p className="text-muted-foreground">Welcome back. Here's an overview of your brand's performance.</p>
        </div>
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center">
              <h3 className="mb-1 text-lg font-medium text-red-600">Error loading dashboard</h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Brand Dashboard</h1>
            <p className="text-muted-foreground">Welcome back. Here's an overview of your brand's performance.</p>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[80px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back. Here's an overview of your brand's performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleTimeRangeChange('7d')} 
            className={timeRange === '7d' ? 'bg-muted' : ''}
          >
            7 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleTimeRangeChange('30d')} 
            className={timeRange === '30d' ? 'bg-muted' : ''}
          >
            30 Days
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleTimeRangeChange('90d')} 
            className={timeRange === '90d' ? 'bg-muted' : ''}
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Quick stats cards */}
      <QuickStatsCards analytics={analytics} />

      {/* Main content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Left column */}
        <div className="col-span-4 space-y-4 md:col-span-4">
          <SalesCharts 
            orders={analytics?.orders || []}
          />
        </div>

        {/* Right column */}
        <div className="col-span-3 space-y-4 md:col-span-3">
          <ComplianceChart />
          <RecentActivities />
        </div>
      </div>
      
      {/* Pending Applications */}
      <PendingApplications />
    </div>
  );
};

export default BrandOverview;
