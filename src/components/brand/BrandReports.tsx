
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart } from "@/components/ui/chart";
import { Download } from "lucide-react";

const BrandReports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  
  // Sample formatted data for charts using the correct format expected by our PieChart component
  const salesDistribution = {
    labels: ["Amazon", "Walmart", "eBay", "Direct"],
    datasets: [{
      label: "Sales Distribution",
      data: [42, 28, 18, 12],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
    }]
  };
  
  const categoryDistribution = {
    labels: ["Electronics", "Home Goods", "Beauty", "Apparel", "Food"],
    datasets: [{
      label: "Category Distribution",
      data: [35, 25, 20, 15, 5],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]
    }]
  };
  
  const resellerPerformance = {
    labels: ["Top 10%", "Next 20%", "Middle 30%", "Bottom 40%"],
    datasets: [{
      label: "Reseller Distribution",
      data: [45, 30, 20, 5],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
    }]
  };
  
  const inventoryValueDistribution = {
    labels: ["In Stock", "Low Stock", "Out of Stock", "Back-ordered"],
    datasets: [{
      label: "Inventory Value",
      data: [68, 17, 10, 5],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
    }]
  };
  
  const mapComplianceDistribution = {
    labels: ["Compliant", "Minor Violations", "Severe Violations"],
    datasets: [{
      label: "MAP Compliance",
      data: [75, 20, 5],
      backgroundColor: ["#00C49F", "#FFBB28", "#FF8042"]
    }]
  };
  
  const channelDistribution = {
    labels: ["Online", "Brick & Mortar", "Dropshipping"],
    datasets: [{
      label: "Channel Distribution",
      data: [65, 25, 10],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28"]
    }]
  };
  
  const regionDistribution = {
    labels: ["North America", "Europe", "Asia", "Other"],
    datasets: [{
      label: "Regional Distribution",
      data: [55, 25, 15, 5],
      backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
    }]
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">View and export performance reports for your brand</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="resellers">Resellers</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Marketplace</CardTitle>
                <CardDescription>Distribution of sales across marketplaces</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={salesDistribution} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={categoryDistribution} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Overview</CardTitle>
                <CardDescription>Key sales metrics for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">$142,384</p>
                    <div className="flex items-center text-sm text-green-500">
                      +12.5% vs previous month
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Average Order Value</p>
                    <p className="text-2xl font-bold">$86.32</p>
                    <div className="flex items-center text-sm text-green-500">
                      +3.2% vs previous month
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="text-2xl font-bold">1,648</p>
                    <div className="flex items-center text-sm text-green-500">
                      +8.7% vs previous month
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Value Distribution</CardTitle>
                <CardDescription>Distribution of inventory value by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={inventoryValueDistribution} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health Metrics</CardTitle>
                <CardDescription>Key inventory metrics for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 pt-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Total SKUs</p>
                    <p className="text-2xl font-bold">543</p>
                    <div className="flex items-center text-sm text-green-500">
                      +15 new products
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Inventory Value</p>
                    <p className="text-2xl font-bold">$482,950</p>
                    <div className="flex items-center text-sm text-yellow-500">
                      +2.1% vs target
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
                    <p className="text-2xl font-bold">24</p>
                    <div className="flex items-center text-sm text-red-500">
                      4.4% of catalog
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resellers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reseller Performance</CardTitle>
              <CardDescription>Distribution of sales by reseller performance tiers</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PieChart data={resellerPerformance} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Resellers by Revenue</CardTitle>
              <CardDescription>Top 5 resellers by total revenue generated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mega Electronics Inc.</p>
                    <p className="text-sm text-muted-foreground">12,500+ units sold</p>
                  </div>
                  <p className="font-bold">$387,250</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Global Distributors LLC</p>
                    <p className="text-sm text-muted-foreground">8,750+ units sold</p>
                  </div>
                  <p className="font-bold">$268,430</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Prime Retail Solutions</p>
                    <p className="text-sm text-muted-foreground">7,300+ units sold</p>
                  </div>
                  <p className="font-bold">$184,650</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Metro Wholesale</p>
                    <p className="text-sm text-muted-foreground">5,800+ units sold</p>
                  </div>
                  <p className="font-bold">$152,340</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Retail Accelerators</p>
                    <p className="text-sm text-muted-foreground">4,200+ units sold</p>
                  </div>
                  <p className="font-bold">$128,750</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>MAP Compliance</CardTitle>
                <CardDescription>Distribution of MAP compliance across resellers</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <PieChart data={mapComplianceDistribution} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Compliance Metrics</CardTitle>
                <CardDescription>Key compliance metrics for the current month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 pt-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">MAP Violations</p>
                    <p className="text-2xl font-bold">12</p>
                    <div className="flex items-center text-sm text-green-500">
                      -15% from last month
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Content Issues</p>
                    <p className="text-2xl font-bold">8</p>
                    <div className="flex items-center text-sm text-green-500">
                      -25% from last month
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Resolved Cases</p>
                    <p className="text-2xl font-bold">15</p>
                    <div className="flex items-center text-sm text-green-500">
                      93% resolution rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Channel Distribution</CardTitle>
                <CardDescription>Sales by channel type</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <PieChart data={channelDistribution} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
                <CardDescription>Sales by geographic region</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <PieChart data={regionDistribution} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales Velocity</CardTitle>
                <CardDescription>Product sell-through rate</CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <div className="flex h-full flex-col items-center justify-center gap-4 pt-4">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-primary">24.8</p>
                    <p className="text-sm text-muted-foreground">days average inventory turnover</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-green-500">+12%</p>
                    <p className="text-sm text-muted-foreground">improvement vs. last quarter</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution Efficiency</CardTitle>
              <CardDescription>Key distribution metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Average Delivery Time</p>
                  <p className="text-2xl font-bold">3.2 days</p>
                  <div className="flex items-center text-sm text-green-500">
                    -0.5 days vs last quarter
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Shipping Cost Ratio</p>
                  <p className="text-2xl font-bold">8.4%</p>
                  <div className="flex items-center text-sm text-green-500">
                    -0.7% vs last quarter
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Return Rate</p>
                  <p className="text-2xl font-bold">2.1%</p>
                  <div className="flex items-center text-sm text-green-500">
                    -0.3% vs last quarter
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Order Accuracy</p>
                  <p className="text-2xl font-bold">99.7%</p>
                  <div className="flex items-center text-sm text-green-500">
                    +0.2% vs last quarter
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandReports;
