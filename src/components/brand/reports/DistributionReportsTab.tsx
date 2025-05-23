
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/ui/chart";

// Sample formatted data for charts
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

const DistributionReportsTab = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default DistributionReportsTab;
