
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart } from "@/components/ui/chart";
import { Download } from "lucide-react";

// Sample formatted data for charts
const mapComplianceDistribution = {
  labels: ["Compliant", "Minor Violations", "Severe Violations"],
  datasets: [{
    label: "MAP Compliance",
    data: [75, 20, 5],
    backgroundColor: ["#00C49F", "#FFBB28", "#FF8042"]
  }]
};

const ComplianceReportsTab = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default ComplianceReportsTab;
