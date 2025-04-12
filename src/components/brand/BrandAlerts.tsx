
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, ShoppingCart, AlertTriangle, User } from "lucide-react";

const BrandAlerts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <p className="text-muted-foreground">Monitor MAP compliance and stay updated on important events</p>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="map">MAP Violations</TabsTrigger>
          <TabsTrigger value="orders">Order Alerts</TabsTrigger>
          <TabsTrigger value="resellers">Reseller Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Bell className="mr-2 h-5 w-5 text-muted-foreground" />
                <CardTitle>Recent Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-medium">No active alerts</h3>
                  <p className="text-muted-foreground">
                    When you have new alerts, they will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="map" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                <CardTitle>MAP Compliance Violations</CardTitle>
              </div>
              <CardDescription>
                Products being sold below your minimum advertised price
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-medium">No MAP violations detected</h3>
                  <p className="text-muted-foreground">
                    When price violations are detected, they will be listed here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5 text-blue-500" />
                <CardTitle>Order Alerts</CardTitle>
              </div>
              <CardDescription>
                Notifications about orders and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-medium">No order alerts</h3>
                  <p className="text-muted-foreground">
                    Order alerts will appear here when triggered.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resellers" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <User className="mr-2 h-5 w-5 text-green-500" />
                <CardTitle>Reseller Alerts</CardTitle>
              </div>
              <CardDescription>
                Notifications about reseller activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-medium">No reseller alerts</h3>
                  <p className="text-muted-foreground">
                    Reseller activity alerts will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandAlerts;
