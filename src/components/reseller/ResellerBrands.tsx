
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ResellerBrands = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Partnerships</h1>
        <p className="text-muted-foreground">Browse and manage your brand partnerships</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Brand Directory</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResellerBrands;
