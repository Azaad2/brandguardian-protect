
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ResellerShipments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shipment Tracking</h1>
        <p className="text-muted-foreground">Monitor the status of your incoming shipments</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Shipments</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResellerShipments;
