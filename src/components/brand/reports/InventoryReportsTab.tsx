
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart } from "@/components/ui/chart";
import { Download } from "lucide-react";

// Sample formatted data for charts
const inventoryValueDistribution = {
  labels: ["In Stock", "Low Stock", "Out of Stock", "Back-ordered"],
  datasets: [{
    label: "Inventory Value",
    data: [68, 17, 10, 5],
    backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
  }]
};

const InventoryReportsTab = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default InventoryReportsTab;
