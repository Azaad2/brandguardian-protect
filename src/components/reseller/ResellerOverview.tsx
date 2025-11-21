
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Package, ShoppingCart, Building, Loader2, Crown, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useResellerOrders } from '@/hooks/use-reseller-orders';
import { useResellerMessages } from '@/hooks/use-reseller-messages';
import { useResellerBrands } from '@/hooks/use-reseller-brands';
import { useResellerAnalytics } from '@/hooks/use-reseller-analytics';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ResellerOverview = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'3m'|'6m'|'1y'>('3m');
  const { orders, isLoading: isLoadingOrders } = useResellerOrders();
  const { brands, isLoading: isLoadingBrands } = useResellerBrands();
  const { analytics, isLoading: isLoadingAnalytics } = useResellerAnalytics(timeRange);
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();

  if (!user) {
    return (
      <div className="space-y-6">
        <Alert variant="default">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication required</AlertTitle>
          <AlertDescription>
            Please sign in to view your dashboard
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoading = isLoadingOrders || isLoadingBrands || isLoadingAnalytics;

  // Prepare recent orders (limited to 5)
  const recentOrders = orders.slice(0, 5).map(order => ({
    id: order.id.substring(0, 8),
    brand: order.brandName,
    amount: order.total,
    status: order.status,
    date: order.date
  }));

  // Prepare top brands (limited to 5)
  const topBrands = brands.slice(0, 5).map(brand => ({
    name: brand.name,
    products: brand.productsCount,
    revenue: `$${Math.round(Math.random() * 30000 + 10000)}`, // Simulated revenue
    profit: `${Math.round(Math.random() * 10 + 15)}%` // Simulated profit margin
  }));

  // Show upgrade CTA for free tier users
  const showUpgradeCTA = !isLoadingSubscription && (!subscription?.subscribed || subscription?.subscription_tier === 'free');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your wholesale purchasing portal.</p>
      </div>

      {/* Upgrade CTA Card */}
      {showUpgradeCTA && (
        <Card className="border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Unlock Premium Features</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Get unlimited brand applications, priority support, advanced analytics, and faster approvals with a premium subscription.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="flex items-center gap-1 text-xs bg-background/50 px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Unlimited Applications</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-background/50 px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-background/50 px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs bg-background/50 px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>Exclusive Brands</span>
                  </div>
                </div>
              </div>
              <Button asChild className="flex-shrink-0">
                <Link to="/reseller/dashboard/subscription">
                  View Plans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Spending</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">${analytics.totalSales.toLocaleString()}</h2>
                    <p className="text-sm font-medium text-green-500">
                      <span className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        15%
                      </span>
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Brand Partners</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">{analytics.brandCount}</h2>
                    <p className="text-sm font-medium text-green-500">
                      <span className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        {analytics.pendingApprovals}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <Building className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Products</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">
                      {brands.reduce((sum, brand) => sum + brand.productsCount, 0)}
                    </h2>
                    <p className="text-sm font-medium text-green-500">
                      <span className="flex items-center">
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                        12%
                      </span>
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-amber-100 p-3">
                  <Package className="h-6 w-6 text-amber-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <div className="flex items-center justify-between space-x-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                  <div className="flex items-baseline space-x-2">
                    <h2 className="text-3xl font-bold">
                      {orders.filter(o => o.status !== 'delivered').length}
                    </h2>
                    {orders.filter(o => o.status !== 'delivered').length > 
                     orders.filter(o => o.status === 'delivered').length ? (
                      <p className="text-sm font-medium text-green-500">
                        <span className="flex items-center">
                          <ArrowUpRight className="mr-1 h-4 w-4" />
                          {orders.filter(o => o.status !== 'delivered').length - 
                           orders.filter(o => o.status === 'delivered').length}
                        </span>
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-red-500">
                        <span className="flex items-center">
                          <ArrowDownRight className="mr-1 h-4 w-4" />
                          {orders.filter(o => o.status === 'delivered').length - 
                           orders.filter(o => o.status !== 'delivered').length}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="rounded-full bg-violet-100 p-3">
                  <ShoppingCart className="h-6 w-6 text-violet-500" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Tabs defaultValue="orders">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Performance</CardTitle>
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="spending">Spending</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <TabsContent value="orders" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.salesData?.datasets?.[0]?.data ? 
                      analytics.salesData.labels.map((label, i) => ({
                        name: label,
                        orders: Math.round(analytics.salesData.datasets[0].data[i] / analytics.averageOrderValue)
                      })) : []}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="spending" className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.salesData?.labels ? 
                      analytics.salesData.labels.map((label, i) => ({
                        name: label,
                        spending: analytics.salesData.datasets.reduce(
                          (sum, dataset) => sum + (dataset.data[i] || 0), 0
                        )
                      })) : []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="spending" stroke="#8b5cf6" />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </>
            )}
          </CardContent>
        </Tabs>

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.brandPerformanceData?.datasets?.[0]?.data ? 
                        analytics.brandPerformanceData.labels.map((label, i) => ({
                          name: label,
                          value: analytics.brandPerformanceData.datasets[0].data[i]
                        })) : []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.brandPerformanceData?.datasets?.[0]?.backgroundColor?.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-6">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Brand</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map(order => (
                        <tr key={order.id} className="border-b">
                          <td className="py-3">{order.id}</td>
                          <td className="py-3">{order.brand}</td>
                          <td className="py-3">{order.amount}</td>
                          <td className="py-3">{order.date}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                order.status === 'delivered'
                                  ? 'bg-green-100 text-green-700'
                                  : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          No recent orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Top Brands</CardTitle>
            <CardDescription>Brands with highest purchase volume</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            {isLoading ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium">Brand</th>
                      <th className="pb-3 font-medium">Products</th>
                      <th className="pb-3 font-medium">Revenue</th>
                      <th className="pb-3 font-medium">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topBrands.length > 0 ? (
                      topBrands.map(brand => (
                        <tr key={brand.name} className="border-b">
                          <td className="py-3">{brand.name}</td>
                          <td className="py-3">{brand.products}</td>
                          <td className="py-3">{brand.revenue}</td>
                          <td className="py-3">{brand.profit}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground">
                          No brand partnerships found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResellerOverview;
