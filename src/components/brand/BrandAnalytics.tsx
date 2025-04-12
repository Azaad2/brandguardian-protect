
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const BrandAnalytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track sales performance and trends</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default BrandAnalytics;
