
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

interface DashboardData {
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

interface QuickStatsCardsProps {
  dashboardData: DashboardData;
}

const QuickStatsCards = ({ dashboardData }: QuickStatsCardsProps) => {
  return (
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
  );
};

export default QuickStatsCards;
