
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const orders = [
  {
    id: "ORD-2024-001",
    brandName: "TechElite",
    date: "2024-04-20",
    total: "$5,280.00",
    status: "Processing",
    items: 12
  },
  {
    id: "ORD-2024-002",
    brandName: "HomeStyle",
    date: "2024-04-19",
    total: "$3,450.00",
    status: "Shipped",
    items: 8
  },
  {
    id: "ORD-2024-003",
    brandName: "FashionPro",
    date: "2024-04-18",
    total: "$2,890.00",
    status: "Delivered",
    items: 15
  },
  {
    id: "ORD-2024-004",
    brandName: "BeautyEssentials",
    date: "2024-04-17",
    total: "$1,750.00",
    status: "Processing",
    items: 6
  }
];

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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.brandName}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <span className={`rounded-full px-2 py-1 text-xs ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
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

export default ResellerOrders;
