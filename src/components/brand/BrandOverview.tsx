
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsUp,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';

const BrandOverview = () => {
  const [timeRange, setTimeRange] = useState('7d');

  // Sample data - in a real app, this would come from an API
  const dashboardData = {
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

  // Sample chart data
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
          <Button variant="outline" size="sm" onClick={() => setTimeRange('7d')} className={timeRange === '7d' ? 'bg-muted' : ''}>
            7 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('30d')} className={timeRange === '30d' ? 'bg-muted' : ''}>
            30 Days
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('90d')} className={timeRange === '90d' ? 'bg-muted' : ''}>
            90 Days
          </Button>
        </div>
      </div>

      {/* Quick stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Authorized Resellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.resellers.authorized}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">{dashboardData.resellers.growth}%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Link to="/brand/dashboard/resellers">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  View all resellers
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.listings.active}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Across all marketplaces</span>
            </div>
            <div className="mt-3">
              <Link to="/brand/dashboard/listings">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  View all listings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MAP Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.compliance.mapViolations}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-amber-500">Requires attention</span>
            </div>
            <div className="mt-3">
              <Link to="/brand/dashboard/compliance">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  View compliance issues
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(dashboardData.sales.totalRevenue).toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ChevronsUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">{dashboardData.sales.growthRate}%</span>
              <span className="ml-1">from last month</span>
            </div>
            <div className="mt-3">
              <Link to="/brand/dashboard/analytics">
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  View analytics
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Left column */}
        <div className="col-span-4 space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Total revenue across all channels and resellers</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <LineChart data={revenueData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} className="w-full" />
            </CardContent>
          </Card>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Marketplace Distribution</CardTitle>
              <CardDescription>Sales and listing distribution across marketplaces</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px]">
              <div className="w-full max-w-[300px]">
                <PieChart data={marketplaceData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
              <CardDescription>MAP violations and resolution trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={complianceData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} className="w-full" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest events and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New reseller approved</p>
                    <p className="text-xs text-muted-foreground">Summit Retail has been approved</p>
                  </div>
                  <div className="text-xs text-muted-foreground">2h ago</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">MAP violation detected</p>
                    <p className="text-xs text-muted-foreground">Premium Skincare Collection on Amazon</p>
                  </div>
                  <div className="text-xs text-muted-foreground">5h ago</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Content issue resolved</p>
                    <p className="text-xs text-muted-foreground">Product description updated</p>
                  </div>
                  <div className="text-xs text-muted-foreground">1d ago</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Unauthorized seller detected</p>
                    <p className="text-xs text-muted-foreground">ValuSellers on eBay</p>
                  </div>
                  <div className="text-xs text-muted-foreground">1d ago</div>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm">View all activities</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Pending Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Recent reseller applications awaiting review</CardDescription>
          </div>
          <Link to="/brand/dashboard/resellers">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Company</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Budget</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">Acme Distribution</div>
                      <div className="text-xs text-muted-foreground">contact@acmedist.com</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Apr 10, 2023</td>
                  <td className="px-4 py-3 text-muted-foreground">$25k-$50k</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8">View</Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="h-8">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">Peak Distribution</div>
                      <div className="text-xs text-muted-foreground">wholesale@peakdist.com</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Apr 01, 2023</td>
                  <td className="px-4 py-3 text-muted-foreground">$5k-$10k</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8">View</Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <X className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="h-8">
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandOverview;
