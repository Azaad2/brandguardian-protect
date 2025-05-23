
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart } from "@/components/ui/chart";
import { Download } from "lucide-react";

// Sample data for charts
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

const SalesReportsTab = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default SalesReportsTab;
