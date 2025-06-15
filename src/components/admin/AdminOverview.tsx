import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Package, ShoppingCart, AlertTriangle, TrendingUp, FileText } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface AdminStats {
  totalResellers: number;
  totalBrands: number;
  totalProducts: number;
  totalOrders: number;
  pendingApplications: number;
  pendingUploads: number;
}

interface RecentActivity {
  id: string;
  type: 'reseller_signup' | 'brand_signup' | 'product_upload' | 'order_placed' | 'application_submitted';
  user_email: string;
  company_name?: string;
  description: string;
  created_at: string;
}

const AdminOverview = () => {
  console.log('AdminOverview component rendering');
  
  const [stats, setStats] = useState<AdminStats>({
    totalResellers: 0,
    totalBrands: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingApplications: 0,
    pendingUploads: 0,
  });

  // Fetch admin statistics
  const { data: adminData, isLoading, error } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: async () => {
      console.log('Fetching admin overview data...');
      
      // Fetch resellers count from profiles table
      const { data: resellers, error: resellersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_role', 'reseller');

      // Fetch brands count from profiles table
      const { data: brands, error: brandsError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_role', 'brand');

      // Fetch products count
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id');

      // Fetch orders count
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id');

      // Fetch pending applications
      const { data: pendingApps, error: pendingAppsError } = await supabase
        .from('reseller_applications')
        .select('id')
        .eq('status', 'pending');

      // Fetch pending product uploads
      const { data: pendingUploads, error: pendingUploadsError } = await supabase
        .from('product_uploads')
        .select('id')
        .eq('status', 'pending');

      if (resellersError || brandsError || productsError || ordersError || pendingAppsError || pendingUploadsError) {
        console.error('Error fetching data:', { resellersError, brandsError, productsError, ordersError, pendingAppsError, pendingUploadsError });
        throw new Error('Failed to fetch admin statistics');
      }

      const result = {
        totalResellers: resellers?.length || 0,
        totalBrands: brands?.length || 0,
        totalProducts: products?.length || 0,
        totalOrders: orders?.length || 0,
        pendingApplications: pendingApps?.length || 0,
        pendingUploads: pendingUploads?.length || 0,
      };
      
      console.log('Fetched admin data:', result);
      return result;
    },
  });

  // Fetch recent activities from both resellers and brands
  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const activities: RecentActivity[] = [];

      // Recent reseller applications
      const { data: applications } = await supabase
        .from('reseller_applications')
        .select('id, email, company_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      applications?.forEach(app => {
        activities.push({
          id: app.id,
          type: 'application_submitted',
          user_email: app.email,
          company_name: app.company_name,
          description: `New reseller application from ${app.company_name}`,
          created_at: app.created_at,
        });
      });

      // Recent product uploads
      const { data: uploads } = await supabase
        .from('product_uploads')
        .select('id, name, brand_id, created_at, profiles!product_uploads_brand_id_fkey(email, company_name)')
        .order('created_at', { ascending: false })
        .limit(5);

      uploads?.forEach(upload => {
        const profile = upload.profiles as any;
        activities.push({
          id: upload.id,
          type: 'product_upload',
          user_email: profile?.email || 'Unknown',
          company_name: profile?.company_name || 'Unknown Brand',
          description: `Product catalog "${upload.name}" uploaded`,
          created_at: upload.created_at,
        });
      });

      // Recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total_amount, created_at, brand_id, reseller_id')
        .order('created_at', { ascending: false })
        .limit(5);

      orders?.forEach(order => {
        activities.push({
          id: order.id,
          type: 'order_placed',
          user_email: 'Order System',
          description: `New order placed - $${order.total_amount}`,
          created_at: order.created_at,
        });
      });

      // Sort all activities by date
      return activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  });

  useEffect(() => {
    if (adminData) {
      console.log('Setting admin stats:', adminData);
      setStats(adminData);
    }
  }, [adminData]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application_submitted':
        return <Users className="h-4 w-4" />;
      case 'product_upload':
        return <Package className="h-4 w-4" />;
      case 'order_placed':
        return <ShoppingCart className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'application_submitted':
        return 'bg-blue-100 text-blue-800';
      case 'product_upload':
        return 'bg-green-100 text-green-800';
      case 'order_placed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    console.log('AdminOverview is loading...');
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    console.error('AdminOverview error:', error);
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading admin data</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  console.log('AdminOverview rendering main content with stats:', stats);

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor platform activities from both resellers and brands
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResellers}</div>
            <p className="text-xs text-muted-foreground">Active reseller accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBrands}</div>
            <p className="text-xs text-muted-foreground">Active brand accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Orders processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Uploads</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingUploads}</div>
            <p className="text-xs text-muted-foreground">Catalogs to review</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Platform Activities</CardTitle>
          <CardDescription>
            Latest activities from resellers and brands across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities?.length ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 rounded-lg border p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-muted-foreground">{activity.user_email}</p>
                      {activity.company_name && (
                        <Badge variant="outline" className="text-xs">
                          {activity.company_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${getActivityBadgeColor(activity.type)}`}>
                      {activity.type.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No recent activities to display
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverview;
