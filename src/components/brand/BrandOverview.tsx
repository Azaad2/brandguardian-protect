
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, Package, ShoppingCart } from 'lucide-react';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
];

const ordersData = [
  { name: 'Jan', orders: 240 },
  { name: 'Feb', orders: 180 },
  { name: 'Mar', orders: 300 },
  { name: 'Apr', orders: 270 },
  { name: 'May', orders: 360 },
  { name: 'Jun', orders: 330 },
  { name: 'Jul', orders: 420 },
];

const resellerData = [
  { name: 'Jan', active: 24, pending: 5 },
  { name: 'Feb', active: 28, pending: 3 },
  { name: 'Mar', active: 32, pending: 7 },
  { name: 'Apr', active: 37, pending: 4 },
  { name: 'May', active: 42, pending: 6 },
  { name: 'Jun', active: 48, pending: 8 },
  { name: 'Jul', active: 53, pending: 5 },
];

const recentResellers = [
  { id: 1, name: 'Acme Distribution', status: 'Pending', date: '2023-04-10', budget: '$25k-50k' },
  { id: 2, name: 'Metro Wholesale', status: 'Approved', date: '2023-04-08', budget: '$10k-25k' },
  { id: 3, name: 'Summit Retail', status: 'Approved', date: '2023-04-05', budget: '$50k-100k' },
  { id: 4, name: 'Harbor Markets', status: 'Rejected', date: '2023-04-02', budget: 'Under $5k' },
  { id: 5, name: 'Peak Distribution', status: 'Pending', date: '2023-04-01', budget: '$5k-10k' },
];

const recentOrders = [
  { id: 'ORD-5523', reseller: 'Metro Wholesale', amount: '$12,400', status: 'Processing' },
  { id: 'ORD-5522', reseller: 'Summit Retail', amount: '$8,750', status: 'Shipped' },
  { id: 'ORD-5521', reseller: 'Zenith Distributors', amount: '$5,200', status: 'Delivered' },
  { id: 'ORD-5520', reseller: 'Metro Wholesale', amount: '$9,300', status: 'Processing' },
  { id: 'ORD-5519', reseller: 'Pioneer Wholesale', amount: '$4,600', status: 'Shipped' },
];

const BrandOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your wholesale management portal.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">$45,231</h2>
                  <p className="text-sm font-medium text-green-500">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      12%
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resellers</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">53</h2>
                  <p className="text-sm font-medium text-green-500">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      8%
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Products</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">285</h2>
                  <p className="text-sm font-medium text-green-500">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      4%
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <Package className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Orders</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">124</h2>
                  <p className="text-sm font-medium text-red-500">
                    <span className="flex items-center">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      3%
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-violet-100 p-3">
                <ShoppingCart className="h-6 w-6 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Tabs defaultValue="sales">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Performance</CardTitle>
              <TabsList>
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <TabsContent value="sales" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="orders" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Tabs>

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Reseller Growth</CardTitle>
            <CardDescription>Active vs. Pending Resellers</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resellerData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" stackId="a" fill="#10b981" />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="p-6">
            <CardTitle>Recent Reseller Applications</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Application Date</th>
                    <th className="pb-3 font-medium">Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResellers.map(reseller => (
                    <tr key={reseller.id} className="border-b">
                      <td className="py-3">{reseller.name}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            reseller.status === 'Approved'
                              ? 'bg-green-100 text-green-700'
                              : reseller.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {reseller.status}
                        </span>
                      </td>
                      <td className="py-3">{reseller.date}</td>
                      <td className="py-3">{reseller.budget}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">Reseller</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.reseller}</td>
                      <td className="py-3">{order.amount}</td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            order.status === 'Delivered'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandOverview;
