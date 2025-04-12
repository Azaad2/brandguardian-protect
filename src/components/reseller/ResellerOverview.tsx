
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, DollarSign, Package, ShoppingCart, Building } from 'lucide-react';

const orderData = [
  { name: 'Jan', orders: 8 },
  { name: 'Feb', orders: 12 },
  { name: 'Mar', orders: 15 },
  { name: 'Apr', orders: 10 },
  { name: 'May', orders: 18 },
  { name: 'Jun', orders: 20 },
  { name: 'Jul', orders: 25 },
];

const spendingData = [
  { name: 'Jan', spending: 12000 },
  { name: 'Feb', spending: 18000 },
  { name: 'Mar', spending: 22000 },
  { name: 'Apr', spending: 15000 },
  { name: 'May', spending: 24000 },
  { name: 'Jun', spending: 28000 },
  { name: 'Jul', spending: 32000 },
];

const categoryData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home Goods', value: 20 },
  { name: 'Beauty', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const recentOrders = [
  { id: 'ORD-4503', brand: 'TechElite', amount: '$5,200', status: 'Processing', date: '2023-04-10' },
  { id: 'ORD-4502', brand: 'LuxuryHome', amount: '$3,750', status: 'Shipped', date: '2023-04-08' },
  { id: 'ORD-4501', brand: 'FashionFwd', amount: '$2,100', status: 'Delivered', date: '2023-04-05' },
  { id: 'ORD-4500', brand: 'GadgetGo', amount: '$4,300', status: 'Processing', date: '2023-04-02' },
];

const topBrands = [
  { name: 'TechElite', products: 45, revenue: '$42,500', profit: '18%' },
  { name: 'LuxuryHome', products: 32, revenue: '$38,200', profit: '22%' },
  { name: 'FashionFwd', products: 67, revenue: '$36,800', profit: '15%' },
  { name: 'GadgetGo', products: 28, revenue: '$24,600', profit: '20%' },
  { name: 'BeautyGlow', products: 35, revenue: '$18,900', profit: '25%' },
];

const ResellerOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your wholesale purchasing portal.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spending</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">$32,450</h2>
                  <p className="text-sm font-medium text-green-500">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      15%
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
                <p className="text-sm font-medium text-muted-foreground">Brand Partners</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">12</h2>
                  <p className="text-sm font-medium text-green-500">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      3
                    </span>
                  </p>
                </div>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Building className="h-6 w-6 text-blue-500" />
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
                  <h2 className="text-3xl font-bold">385</h2>
                  <p className="text-sm font-medium text-green-500">
                    <span className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      12%
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
                <p className="text-sm font-medium text-muted-foreground">Active Orders</p>
                <div className="flex items-baseline space-x-2">
                  <h2 className="text-3xl font-bold">8</h2>
                  <p className="text-sm font-medium text-red-500">
                    <span className="flex items-center">
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                      2
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
        <Tabs defaultValue="orders">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between">
              <CardTitle>Performance</CardTitle>
              <TabsList>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="spending">Spending</TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <TabsContent value="orders" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="spending" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="spending" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </CardContent>
        </Tabs>

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
                    <th className="pb-3 font-medium">Brand</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b">
                      <td className="py-3">{order.id}</td>
                      <td className="py-3">{order.brand}</td>
                      <td className="py-3">{order.amount}</td>
                      <td className="py-3">{order.date}</td>
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

        <Card>
          <CardHeader className="p-6">
            <CardTitle>Top Brands</CardTitle>
            <CardDescription>Brands with highest purchase volume</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 font-medium">Brand</th>
                    <th className="pb-3 font-medium">Products</th>
                    <th className="pb-3 font-medium">Revenue</th>
                    <th className="pb-3 font-medium">Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {topBrands.map(brand => (
                    <tr key={brand.name} className="border-b">
                      <td className="py-3">{brand.name}</td>
                      <td className="py-3">{brand.products}</td>
                      <td className="py-3">{brand.revenue}</td>
                      <td className="py-3">{brand.profit}</td>
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

export default ResellerOverview;
