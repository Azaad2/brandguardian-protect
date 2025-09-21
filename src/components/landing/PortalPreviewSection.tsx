import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Package, 
  MessageCircle,
  Settings,
  UserCog,
  PackageCheck,
  Store,
  LayoutDashboard,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { LineChart, BarChart, PieChart } from '@/components/ui/chart';

const PortalPreviewSection = () => {
  const [activePortal, setActivePortal] = useState('brand');

  // Mock data for charts
  const salesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [12000, 15000, 18000, 22000, 25000, 28000],
      backgroundColor: 'hsl(var(--primary))',
      borderColor: 'hsl(var(--primary))',
    }]
  };

  const complianceData = {
    labels: ['Compliant', 'Minor Issues', 'Major Violations'],
    datasets: [{
      label: 'Compliance Status',
      data: [85, 12, 3],
      backgroundColor: [
        'hsl(var(--crystal-blue))',
        'hsl(var(--ai-neural))',
        'hsl(var(--destructive))',
      ],
    }]
  };

  const MockSidebar = ({ items }: { items: Array<{icon: React.ElementType, title: string, badge?: string}> }) => (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">BndBox</span>
        </div>
        <nav className="space-y-2">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                index === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  const BrandPortal = () => (
    <div className="flex h-[600px] bg-background rounded-lg border shadow-lg overflow-hidden">
      <MockSidebar items={[
        { icon: LayoutDashboard, title: 'Dashboard' },
        { icon: Package, title: 'Inventory' },
        { icon: Users, title: 'Resellers', badge: '24' },
        { icon: ShoppingCart, title: 'Orders', badge: '12' },
        { icon: BarChart3, title: 'Analytics' },
        { icon: MessageCircle, title: 'Messages', badge: '3' },
        { icon: Settings, title: 'Settings' },
      ]} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Brand Dashboard</h2>
          <p className="text-muted-foreground">Monitor your brand performance and reseller network</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold">$28,450</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% vs last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Resellers</p>
                  <p className="text-xl font-bold">24</p>
                  <p className="text-xs text-green-600">+3 new this month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-xl font-bold">156</p>
                  <p className="text-xs text-green-600">+8% this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Compliance</p>
                  <p className="text-xl font-bold">98%</p>
                  <p className="text-xs text-green-600">MAP policy adherence</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <LineChart data={salesData} className="w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <PieChart data={complianceData} className="w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const ResellerPortal = () => (
    <div className="flex h-[600px] bg-background rounded-lg border shadow-lg overflow-hidden">
      <MockSidebar items={[
        { icon: LayoutDashboard, title: 'Dashboard' },
        { icon: Store, title: 'Brands', badge: '18' },
        { icon: ShoppingCart, title: 'Orders', badge: '5' },
        { icon: MessageCircle, title: 'Messages', badge: '2' },
        { icon: Settings, title: 'Settings' },
      ]} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reseller Dashboard</h2>
          <p className="text-muted-foreground">Manage your brand partnerships and orders</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Brand Partners</p>
                  <p className="text-xl font-bold">18</p>
                  <p className="text-xs text-green-600">+2 approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-xl font-bold">23</p>
                  <p className="text-xs text-muted-foreground">5 pending delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Sales</p>
                  <p className="text-xl font-bold">$45,230</p>
                  <p className="text-xs text-green-600">+15% growth</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-xl font-bold">94%</p>
                  <p className="text-xs text-muted-foreground">Order fulfillment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Brand Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'TechGear Pro', status: 'Approved', date: '2 days ago' },
                { name: 'StyleCraft', status: 'Pending', date: '1 week ago' },
                { name: 'HomeEssentials', status: 'Under Review', date: '3 days ago' },
              ].map((application, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{application.name}</p>
                    <p className="text-sm text-muted-foreground">{application.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={application.status === 'Approved' ? 'default' : 
                               application.status === 'Pending' ? 'secondary' : 'outline'}
                    >
                      {application.status}
                    </Badge>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AdminPortal = () => (
    <div className="flex h-[600px] bg-background rounded-lg border shadow-lg overflow-hidden">
      <MockSidebar items={[
        { icon: LayoutDashboard, title: 'Overview' },
        { icon: Users, title: 'Applications', badge: '12' },
        { icon: UserCog, title: 'Approvals', badge: '8' },
        { icon: Building2, title: 'Brands Directory' },
        { icon: PackageCheck, title: 'Catalog Approvals', badge: '4' },
        { icon: Settings, title: 'User Management' },
      ]} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Platform oversight and user management</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xl font-bold">1,247</p>
                  <p className="text-xs text-green-600">+23 this week</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Brands</p>
                  <p className="text-xl font-bold">89</p>
                  <p className="text-xs text-green-600">+5 new brands</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  <p className="text-xl font-bold">12</p>
                  <p className="text-xs text-orange-600">Requires attention</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-xl font-bold">99.9%</p>
                  <p className="text-xs text-green-600">All systems operational</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { company: 'Premium Electronics LLC', type: 'Reseller', status: 'Pending Review', priority: 'High' },
                { company: 'Urban Style Co.', type: 'Brand', status: 'Documentation Required', priority: 'Medium' },
                { company: 'Global Tech Solutions', type: 'Reseller', status: 'Approved', priority: 'Low' },
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{app.company}</p>
                    <p className="text-sm text-muted-foreground">{app.type} Application</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={app.status === 'Approved' ? 'default' : 
                               app.status === 'Pending Review' ? 'destructive' : 'secondary'}
                    >
                      {app.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-crystal-clear to-crystal-mist relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            See BndBox in Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our intuitive dashboards designed for brands, resellers, and administrators. 
            Each portal is tailored to specific workflows and provides real-time insights.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Tabs value={activePortal} onValueChange={setActivePortal} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="brand" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Brand Portal</span>
                <span className="sm:hidden">Brand</span>
              </TabsTrigger>
              <TabsTrigger value="reseller" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">Reseller Portal</span>
                <span className="sm:hidden">Reseller</span>
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Portal</span>
                <span className="sm:hidden">Admin</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brand" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Brand Management Portal</h3>
                <p className="text-muted-foreground">
                  Monitor reseller performance, track compliance, and manage your brand presence across marketplaces.
                </p>
              </div>
              <BrandPortal />
              <div className="text-center">
                <Button size="lg" className="bg-gradient-to-r from-crystal-blue to-ai-neural text-white">
                  Start as a Brand
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="reseller" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Reseller Dashboard</h3>
                <p className="text-muted-foreground">
                  Discover new brands, manage orders, and grow your authorized reseller business.
                </p>
              </div>
              <ResellerPortal />
              <div className="text-center">
                <Button size="lg" className="bg-gradient-to-r from-ai-electric to-ai-pulse text-white">
                  Join as Reseller
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="admin" className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Administrative Control</h3>
                <p className="text-muted-foreground">
                  Comprehensive platform management with user oversight and system monitoring capabilities.
                </p>
              </div>
              <AdminPortal />
              <div className="text-center">
                <Button size="lg" variant="outline">
                  Learn About Enterprise
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">$2.5M+</div>
              <div className="text-sm text-muted-foreground">Monthly GMV</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">99.2%</div>
              <div className="text-sm text-muted-foreground">Compliance Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalPreviewSection;