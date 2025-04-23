
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, BadgeCheck, TrendingUp, Activity, AlertTriangle } from "lucide-react";
import { useState } from "react";

const BrandAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'6m'|'1y'|'2y'>('6m');
  
  // Sample data for analytics
  const revenueProtectionData = {
    labels: timeRange === '6m' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] 
      : timeRange === '1y' 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Jan 23', 'Mar 23', 'May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24'],
    datasets: [
      {
        label: 'Revenue Protected',
        data: timeRange === '6m'
          ? [120000, 145000, 165000, 155000, 180000, 195000]
          : timeRange === '1y'
            ? [120000, 145000, 165000, 155000, 180000, 195000, 210000, 205000, 220000, 235000, 240000, 260000]
            : [80000, 95000, 110000, 130000, 145000, 155000, 175000, 190000, 210000],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      }
    ]
  };

  const unauthorizedSellersData = {
    labels: timeRange === '6m' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] 
      : timeRange === '1y' 
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        : ['Jan 23', 'Mar 23', 'May 23', 'Jul 23', 'Sep 23', 'Nov 23', 'Jan 24', 'Mar 24', 'May 24'],
    datasets: [
      {
        label: 'Unauthorized Sellers Detected',
        data: timeRange === '6m'
          ? [24, 18, 15, 12, 8, 6]
          : timeRange === '1y'
            ? [32, 28, 24, 18, 15, 12, 10, 8, 7, 6, 5, 4]
            : [42, 38, 35, 30, 28, 24, 20, 16, 12],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3
      },
      {
        label: 'Cases Resolved',
        data: timeRange === '6m'
          ? [20, 16, 14, 10, 7, 5]
          : timeRange === '1y'
            ? [28, 25, 20, 16, 14, 10, 9, 7, 6, 5, 5, 3]
            : [36, 34, 30, 26, 25, 20, 18, 14, 10],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3
      }
    ]
  };

  const revenueLossPreventionData = {
    labels: ['Pricing Violations', 'Counterfeit Products', 'Unauthorized Listings', 'Gray Market'],
    datasets: [
      {
        label: 'Revenue Saved by Category',
        data: [380000, 420000, 310000, 210000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(236, 72, 153, 0.7)'
        ],
      }
    ]
  };

  // Calculate totals
  const totalRevenueSaved = revenueProtectionData.datasets[0].data.reduce((sum, num) => sum + num, 0);
  const totalUnauthorizedSellers = unauthorizedSellersData.datasets[0].data.reduce((sum, num) => sum + num, 0);
  const totalCasesResolved = unauthorizedSellersData.datasets[1].data.reduce((sum, num) => sum + num, 0);
  const resolutionRate = Math.round((totalCasesResolved / totalUnauthorizedSellers) * 100);
  const averageSavingsPerCase = Math.round(totalRevenueSaved / totalCasesResolved);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track sales performance and revenue protection</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '6m' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('6m')}
          >
            6 Months
          </Button>
          <Button 
            variant={timeRange === '1y' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('1y')}
          >
            1 Year
          </Button>
          <Button 
            variant={timeRange === '2y' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('2y')}
          >
            2 Years
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue Protected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenueSaved).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From unauthorized seller removal</p>
            <Badge variant="secondary" className="mt-2 flex w-fit items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              26% increase from last year
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <BadgeCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground">Average case resolution</p>
            <Badge variant="secondary" className="mt-2">
              12% higher than industry average
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unauthorized Sellers Found</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUnauthorizedSellers}</div>
            <p className="text-xs text-muted-foreground">Total detected in period</p>
            <Badge variant="secondary" className="mt-2 flex w-fit items-center">
              <TrendingUp className="mr-1 h-3 w-3 rotate-180 transform" />
              35% decrease year-over-year
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Savings Per Case</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageSavingsPerCase.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Revenue protected per resolution</p>
            <Badge variant="secondary" className="mt-2 flex w-fit items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              18% increase this quarter
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Protection</TabsTrigger>
          <TabsTrigger value="sellers">Unauthorized Sellers</TabsTrigger>
          <TabsTrigger value="categories">Loss Prevention Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Protected Over Time</CardTitle>
              <CardDescription>Monthly revenue saved through enforcement actions</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={revenueProtectionData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unauthorized Seller Trends</CardTitle>
              <CardDescription>Detection and resolution rates</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart data={unauthorizedSellersData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Protection by Category</CardTitle>
              <CardDescription>Breakdown of revenue saved by violation type</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PieChart data={revenueLossPreventionData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandAnalytics;
