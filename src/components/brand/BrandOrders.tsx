
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BrandOrders = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-muted-foreground">View and manage wholesale orders from resellers</p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-medium">No orders yet</h3>
                  <p className="text-muted-foreground">
                    When you receive orders from resellers, they will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {["pending", "processing", "shipped", "delivered"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{status} Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                  <div className="text-center">
                    <h3 className="mb-1 text-lg font-medium capitalize">No {status} orders</h3>
                    <p className="text-muted-foreground">
                      When you have {status} orders, they will appear here.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BrandOrders;
