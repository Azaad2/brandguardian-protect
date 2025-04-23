
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Truck } from "lucide-react";

const shipments = [
  {
    id: "SHP-2024-001",
    orderId: "ORD-2024-001",
    carrier: "FedEx",
    trackingNumber: "FX785412369",
    status: "In Transit",
    expectedDelivery: "2024-04-25",
    items: 12
  },
  {
    id: "SHP-2024-002",
    orderId: "ORD-2024-002",
    carrier: "UPS",
    trackingNumber: "UPS45678912",
    status: "Out for Delivery",
    expectedDelivery: "2024-04-23",
    items: 8
  },
  {
    id: "SHP-2024-003",
    orderId: "ORD-2024-003",
    carrier: "DHL",
    trackingNumber: "DHL98765432",
    status: "Delivered",
    expectedDelivery: "2024-04-22",
    items: 15
  },
  {
    id: "SHP-2024-004",
    orderId: "ORD-2024-004",
    carrier: "FedEx",
    trackingNumber: "FX321654987",
    status: "Processing",
    expectedDelivery: "2024-04-26",
    items: 6
  }
];

const ResellerShipments = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Shipment Tracking</h1>
        <p className="text-muted-foreground">Monitor the status of your incoming shipments</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Active Shipments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment ID</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Tracking #</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">{shipment.id}</TableCell>
                  <TableCell>{shipment.orderId}</TableCell>
                  <TableCell>{shipment.carrier}</TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">{shipment.trackingNumber}</span>
                  </TableCell>
                  <TableCell>{shipment.items}</TableCell>
                  <TableCell>{shipment.expectedDelivery}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      shipment.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                      shipment.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {shipment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerShipments;
