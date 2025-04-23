
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, BarChart3, ShoppingCart, BadgePercent, ShoppingBag } from "lucide-react";

const ResellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'3m'|'6m'|'1y'>('3m');
  
  // Sample performance data for different time ranges
  const salesData = {
    labels: timeRange === '3m' 
      ? ['Jan', 'Feb', 'Mar'] 
      : timeRange === '6m' 
        ? ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Amazon Sales',
        data: timeRange === '3m'
          ? [45000, 52000, 58000]
          : timeRange === '6m'
            ? [32000, 36000, 42000, 45000, 52000, 58000]
            : [28000, 30000, 34000, 32000, 36000, 38000, 40000, 43000, 48000, 50000, 55000, 60000],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'Walmart Sales',
        data: timeRange === '3m'
          ? [18000, 22000, 25000]
          : timeRange === '6m'
            ? [12000, 14000, 16000, 18000, 22000, 25000]
            : [9000, 10000, 11500, 12000, 13500, 15000, 16000, 17500, 19000, 21000, 23000, 26000],
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
      },
      {
        label: 'eBay Sales',
        data: timeRange === '3m'
          ? [8000, 9500, 10000]
          : timeRange === '6m'
            ? [5500, 6000, 7000, 8000, 9500, 10000]
            : [4000, 4200, 4500, 5000, 5200, 5500, 6000, 6500, 7000, 8000, 9000, 10500],
        backgroundColor: 'rgba(236, 72, 153, 0.7)',
      }
    ]
  };

  const brandPerformanceData = {
    labels: ['Beauty Co', 'TechGadget', 'HomeEssentials', 'HealthProducts', 'FashionBrand'],
    datasets: [
      {
        label: 'Sales by Brand',
        data: [78000, 65000, 48000, 42000, 35000],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(139, 92, 246, 0.7)'
        ],
      }
    ]
  };

  const marginTrendData = {
    labels: timeRange === '3m' 
      ? ['Jan', 'Feb', 'Mar'] 
      : timeRange === '6m' 
        ? ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Average Margin %',
        data: timeRange === '3m'
          ? [22, 24, 23.5]
          : timeRange === '6m'
            ? [19, 20, 21, 22, 24, 23.5]
            : [18, 18.5, 19, 19.5, 20, 21, 21.5, 22, 22.5, 23, 24, 23.5],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        tension: 0.3
      },
      {
        label: 'Industry Average',
        data: timeRange === '3m'
          ? [19, 19, 19]
          : timeRange === '6m'
            ? [19, 19, 19, 19, 19, 19]
            : [19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19],
        borderColor: 'rgb(148, 163, 184)',
        backgroundColor: 'rgba(148, 163, 184, 0.2)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  const complianceScoreData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Brand Compliance Score',
        data: [82, 84, 86, 85, 88, 90, 92, 94, 95, 96, 97, 98],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3
      }
    ]
  };

  // Calculate totals
  const currentPeriodTotal = salesData.datasets.reduce(
    (sum, dataset) => sum + dataset.data[dataset.data.length - 1], 
    0
  );
  
  const previousPeriodTotal = salesData.datasets.reduce(
    (sum, dataset) => sum + dataset.data[dataset.data.length - 2], 
    0
  );
  
  const growthRate = Math.round(((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100);
  
  const totalOrders = timeRange === '3m' ? 842 : timeRange === '6m' ? 2156 : 4892;
  const averageOrderValue = Math.round(currentPeriodTotal / (totalOrders / (timeRange === '3m' ? 1 : timeRange === '6m' ? 2 : 4)));
  
  const activeBrands = 5;
  const pendingBrandApprovals = 3;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your reseller performance and marketplace sales</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '3m' ? "default" : "outline"} 
            size="sm"
            onClick={() => setTimeRange('3m')}
          >
            3 Months
          </Button>
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
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentPeriodTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '3m' ? 'Last month' : timeRange === '6m' ? 'Last 3 months' : 'Last 6 months'}
            </p>
            <Badge variant={growthRate >= 0 ? "secondary" : "destructive"} className="mt-2 flex w-fit items-center">
              <TrendingUp className={`mr-1 h-3 w-3 ${growthRate < 0 ? "rotate-180 transform" : ""}`} />
              {growthRate}% {growthRate >= 0 ? "increase" : "decrease"} from previous period
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders Processed</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === '3m' ? 'Last 3 months' : timeRange === '6m' ? 'Last 6 months' : 'Last 12 months'}
            </p>
            <div className="mt-2 text-sm">
              Average Order Value: <span className="font-semibold">${averageOrderValue}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.5%</div>
            <p className="text-xs text-muted-foreground">Average across all channels</p>
            <Badge variant="secondary" className="mt-2 flex w-fit items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              4.5% above industry average
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Brand Partnerships</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeBrands}</div>
            <p className="text-xs text-muted-foreground">Active brand relationships</p>
            <div className="mt-2 text-sm">
              <Badge variant="outline" className="bg-yellow-50">
                {pendingBrandApprovals} pending approvals
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Performance</TabsTrigger>
          <TabsTrigger value="brands">Brand Analysis</TabsTrigger>
          <TabsTrigger value="margins">Profit Margins</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Score</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Marketplace</CardTitle>
              <CardDescription>Monthly sales across all platforms</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={salesData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brands" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Brand</CardTitle>
              <CardDescription>Distribution of sales across brand partnerships</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PieChart data={brandPerformanceData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="margins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin Trends</CardTitle>
              <CardDescription>Your margins compared to industry average</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart data={marginTrendData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Brand Compliance Score</CardTitle>
              <CardDescription>Your compliance rating over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart data={complianceScoreData} />
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">MAP Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100%</div>
                <p className="text-xs text-muted-foreground">No violations in last 90 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Content Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">97%</div>
                <p className="text-xs text-muted-foreground">3 minor listing issues resolved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.3%</div>
                <p className="text-xs text-muted-foreground">On-time delivery performance</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerAnalytics;
