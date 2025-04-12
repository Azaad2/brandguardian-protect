
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const ResellerOrders = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your wholesale orders</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResellerOrders;
