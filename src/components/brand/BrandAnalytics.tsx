
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { DollarSign, BadgeCheck } from "lucide-react";

const BrandAnalytics = () => {
  // Sample data for analytics
  const revenueProtectionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue Protected',
        data: [120000, 145000, 165000, 155000, 180000, 195000],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      }
    ]
  };

  const unauthorizedSellersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Unauthorized Sellers Detected',
        data: [24, 18, 15, 12, 8, 6],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        tension: 0.3
      },
      {
        label: 'Cases Resolved',
        data: [20, 16, 14, 10, 7, 5],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.3
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track sales performance and revenue protection</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue Protected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$960,000</div>
            <p className="text-xs text-muted-foreground">From unauthorized seller removal</p>
            <Badge variant="secondary" className="mt-2">
              <BadgeCheck className="mr-1 h-4 w-4" />
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
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">Average case resolution</p>
            <Badge variant="secondary" className="mt-2">
              12% higher than industry average
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Protection</TabsTrigger>
          <TabsTrigger value="sellers">Unauthorized Sellers</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default BrandAnalytics;
