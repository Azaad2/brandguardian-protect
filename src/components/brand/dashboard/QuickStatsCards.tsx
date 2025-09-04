
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertTriangle,
  ArrowUp,
  ChevronsUp,
  DollarSign,
  ShieldCheck,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  totalRevenue: number;
  ordersCount: number;
  resellersCount: number;
  productsCount: number;
  orders: Array<{ 
    total_amount: number; 
    status: string; 
  }>;
}

interface QuickStatsCardsProps {
  analytics?: AnalyticsData;
}

const QuickStatsCards = ({ analytics }: QuickStatsCardsProps) => {
  if (!analytics) {
    return null;
  }

  // Calculate some derived metrics
  const deliveredOrders = analytics.orders.filter(order => order.status === 'delivered').length;
  const pendingOrders = analytics.orders.filter(order => order.status === 'pending').length;
  const deliveredRevenue = analytics.orders
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + Number(order.total_amount), 0);

  // Mock growth percentages (in real app, would calculate from historical data)
  const revenueGrowth = 12.3;
  const resellerGrowth = 8.5;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Authorized Resellers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.resellersCount}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">{resellerGrowth}%</span>
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
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.productsCount}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Available in catalog</span>
          </div>
          <div className="mt-3">
            <Link to="/brand/dashboard/inventory">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                View inventory
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOrders}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="text-amber-500">Requires attention</span>
          </div>
          <div className="mt-3">
            <Link to="/brand/dashboard/orders">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                View pending orders
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ChevronsUp className="mr-1 h-4 w-4 text-green-500" />
            <span className="text-green-500">{revenueGrowth}%</span>
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
  );
};

export default QuickStatsCards;
