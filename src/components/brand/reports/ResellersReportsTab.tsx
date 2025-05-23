
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart } from "@/components/ui/chart";
import { Download } from "lucide-react";

// Sample formatted data for charts
const resellerPerformance = {
  labels: ["Top 10%", "Next 20%", "Middle 30%", "Bottom 40%"],
  datasets: [{
    label: "Reseller Distribution",
    data: [45, 30, 20, 5],
    backgroundColor: ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
  }]
};

const ResellersReportsTab = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ResellersReportsTab;
