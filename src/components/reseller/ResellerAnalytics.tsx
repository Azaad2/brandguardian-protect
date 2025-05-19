
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, BarChart3, ShoppingCart, BadgePercent, ShoppingBag, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useResellerAnalytics } from "@/hooks/use-reseller-analytics";

const ResellerAnalytics = () => {
  const [timeRange, setTimeRange] = useState<'3m'|'6m'|'1y'>('3m');
  const { analytics, isLoading, isError, error } = useResellerAnalytics(timeRange);

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your reseller performance and marketplace sales</p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load analytics data'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Calculate growth rate for display
  const growthRate = 15; // Simulated for now

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
            {isLoading ? (
              <Skeleton className="h-8 w-full mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">${analytics.totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {timeRange === '3m' ? 'Last month' : timeRange === '6m' ? 'Last 3 months' : 'Last 6 months'}
                </p>
                <Badge variant={growthRate >= 0 ? "secondary" : "destructive"} className="mt-2 flex w-fit items-center">
                  <TrendingUp className={`mr-1 h-3 w-3 ${growthRate < 0 ? "rotate-180 transform" : ""}`} />
                  {growthRate}% {growthRate >= 0 ? "increase" : "decrease"} from previous period
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Orders Processed</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics.orderCount}</div>
                <p className="text-xs text-muted-foreground">
                  {timeRange === '3m' ? 'Last 3 months' : timeRange === '6m' ? 'Last 6 months' : 'Last 12 months'}
                </p>
                <div className="mt-2 text-sm">
                  Average Order Value: <span className="font-semibold">${analytics.averageOrderValue}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BadgePercent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics.profitMargin}%</div>
                <p className="text-xs text-muted-foreground">Average across all channels</p>
                <Badge variant="secondary" className="mt-2 flex w-fit items-center">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  4.5% above industry average
                </Badge>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Brand Partnerships</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full mb-2" />
            ) : (
              <>
                <div className="text-2xl font-bold">{analytics.brandCount}</div>
                <p className="text-xs text-muted-foreground">Active brand relationships</p>
                <div className="mt-2 text-sm">
                  <Badge variant="outline" className="bg-yellow-50">
                    {analytics.pendingApprovals} pending approvals
                  </Badge>
                </div>
              </>
            )}
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
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <BarChart data={analytics.salesData} />
              )}
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
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <PieChart data={analytics.brandPerformanceData} />
              )}
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
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <LineChart data={analytics.marginTrendData} />
              )}
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
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <LineChart data={{
                  labels: Array(12).fill(0).map((_, i) => {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const currentMonth = new Date().getMonth();
                    return months[(currentMonth - 11 + i + 12) % 12];
                  }),
                  datasets: [
                    {
                      label: 'Brand Compliance Score',
                      data: [82, 84, 86, 85, 88, 90, 92, 94, 95, 96, 97, 98],
                      borderColor: 'rgb(34, 197, 94)',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      tension: 0.3
                    }
                  ]
                }} />
              )}
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">MAP Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mb-2" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">100%</div>
                    <p className="text-xs text-muted-foreground">No violations in last 90 days</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Content Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mb-2" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">97%</div>
                    <p className="text-xs text-muted-foreground">3 minor listing issues resolved</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-6 w-16 mb-2" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">99.3%</div>
                    <p className="text-xs text-muted-foreground">On-time delivery performance</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerAnalytics;
