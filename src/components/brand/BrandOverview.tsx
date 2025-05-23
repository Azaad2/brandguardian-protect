
import { Button } from '@/components/ui/button';
import QuickStatsCards from './dashboard/QuickStatsCards';
import SalesCharts from './dashboard/SalesCharts';
import ComplianceChart from './dashboard/ComplianceChart';
import RecentActivities from './dashboard/RecentActivities';
import PendingApplications from './dashboard/PendingApplications';
import { useDashboardData, TimeRange } from './dashboard/useDashboardData';

const BrandOverview = () => {
  const { 
    timeRange, 
    setTimeRange,
    dashboardData,
    revenueData,
    marketplaceData, 
    complianceData 
  } = useDashboardData();

  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    // In a real app, this would trigger a data reload
  };

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
      <QuickStatsCards dashboardData={dashboardData} />

      {/* Main content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Left column */}
        <div className="col-span-4 space-y-4 md:col-span-4">
          <SalesCharts 
            revenueData={revenueData} 
            marketplaceData={marketplaceData} 
          />
        </div>

        {/* Right column */}
        <div className="col-span-3 space-y-4 md:col-span-3">
          <ComplianceChart complianceData={complianceData} />
          <RecentActivities />
        </div>
      </div>
      
      {/* Pending Applications */}
      <PendingApplications />
    </div>
  );
};

export default BrandOverview;
