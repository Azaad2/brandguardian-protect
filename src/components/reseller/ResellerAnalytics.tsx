
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ResellerAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track your performance and sales</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResellerAnalytics;
