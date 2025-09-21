import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  ShoppingCart, 
  Package, 
  MessageCircle,
  Settings,
  Store,
  LayoutDashboard,
  Shield,
  CheckCircle,
  DollarSign,
  ArrowUpRight,
  ArrowDown,
  Bell,
  Search,
  Filter,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  Send
} from 'lucide-react';

const PortalPreviewSection = () => {
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
                index === 1 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
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

  const ResellerBrandsPortal = () => (
    <div className="flex h-[500px] bg-background rounded-lg border shadow-lg overflow-hidden">
      <MockSidebar items={[
        { icon: LayoutDashboard, title: 'Dashboard' },
        { icon: Store, title: 'Brands', badge: '156' },
        { icon: ShoppingCart, title: 'Orders', badge: '5' },
        { icon: MessageCircle, title: 'Messages', badge: '2' },
        { icon: Settings, title: 'Settings' },
      ]} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Available Brands</h2>
          <p className="text-muted-foreground">Discover and apply to brand partnerships</p>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
              placeholder="Search brands..."
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { name: 'TechGear Pro', category: 'Electronics', rating: 4.8, minOrder: '$2,500', status: 'Not Applied' },
            { name: 'StyleCraft', category: 'Fashion', rating: 4.6, minOrder: '$1,200', status: 'Applied' },
            { name: 'HomeEssentials', category: 'Home & Garden', rating: 4.9, minOrder: '$800', status: 'Not Applied' },
            { name: 'SportMax', category: 'Sports', rating: 4.7, minOrder: '$1,500', status: 'Not Applied' },
          ].map((brand, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground">{brand.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm">{brand.rating}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Min Order</p>
                  <p className="font-medium">{brand.minOrder}</p>
                </div>
                <Button 
                  size="sm" 
                  disabled={brand.status === 'Applied'}
                  className={brand.status === 'Applied' ? 'opacity-50' : ''}
                >
                  {brand.status === 'Applied' ? 'Applied' : 'Apply'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const BrandApplicationsPortal = () => (
    <div className="flex h-[500px] bg-background rounded-lg border shadow-lg overflow-hidden">
      <MockSidebar items={[
        { icon: LayoutDashboard, title: 'Dashboard' },
        { icon: Package, title: 'Inventory' },
        { icon: Users, title: 'Resellers', badge: '24' },
        { icon: MessageCircle, title: 'Applications', badge: '12' },
        { icon: Settings, title: 'Settings' },
      ]} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reseller Applications</h2>
          <p className="text-muted-foreground">Review and approve new reseller partnerships</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Approved Today</p>
                  <p className="text-xl font-bold">8</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Resellers</p>
                  <p className="text-xl font-bold">156</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {[
            { company: 'Premium Electronics LLC', contact: 'John Smith', experience: '5+ years', status: 'Pending' },
            { company: 'Global Tech Solutions', contact: 'Sarah Johnson', experience: '3+ years', status: 'Under Review' },
            { company: 'Digital Commerce Pro', contact: 'Mike Chen', experience: '7+ years', status: 'Pending' },
          ].map((application, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{application.company}</h3>
                  <p className="text-sm text-muted-foreground">{application.contact}</p>
                  <p className="text-sm text-muted-foreground">{application.experience} Amazon experience</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {application.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Review
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Approve
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const ResellerNotificationsPortal = () => (
    <div className="flex h-[500px] bg-background rounded-lg border shadow-lg overflow-hidden">
      <MockSidebar items={[
        { icon: LayoutDashboard, title: 'Dashboard' },
        { icon: Store, title: 'Brands', badge: '19' },
        { icon: ShoppingCart, title: 'Orders', badge: '5' },
        { icon: MessageCircle, title: 'Messages', badge: '3' },
        { icon: Settings, title: 'Settings' },
      ]} />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! You have new updates.</p>
          </div>
          <Bell className="h-6 w-6 text-primary animate-pulse" />
        </div>
        
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Application Approved!</h3>
          </div>
          <p className="text-green-700">
            Great news! TechGear Pro has approved your reseller application. You can now access their product catalog and start placing orders.
          </p>
          <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
            View Catalog
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Brand Partners</p>
                  <p className="text-xl font-bold">19</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +1 new approval
                  </p>
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
                  <p className="text-xl font-bold">$48,750</p>
                  <p className="text-xs text-green-600">+18% growth</p>
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
                  <p className="text-xl font-bold">96%</p>
                  <p className="text-xs text-muted-foreground">Order fulfillment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Brand Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'TechGear Pro', action: 'Application Approved', time: '2 hours ago', type: 'approved' },
                { name: 'StyleCraft', action: 'New Product Added', time: '1 day ago', type: 'update' },
                { name: 'HomeEssentials', action: 'Order Shipped', time: '2 days ago', type: 'shipped' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'approved' ? 'bg-green-500' : 
                      activity.type === 'update' ? 'bg-blue-500' : 'bg-orange-500'
                    }`} />
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const FlowArrow = () => (
    <div className="flex justify-center my-8">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
          <ArrowDown className="h-4 w-4" />
        </div>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent mt-2" />
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-crystal-clear to-crystal-mist relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient">
            See How BndBox Connects Brands & Resellers
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Follow the seamless workflow from application to approval. Watch how our platform 
            facilitates genuine partnerships between brands and qualified resellers.
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          {/* Step 1: Reseller Discovery & Application */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold">Discover Premium Brands</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Qualified resellers browse our curated directory of premium brands, 
                filtering by category, minimum order requirements, and partnership criteria. 
                Each brand profile shows detailed information including product categories, 
                MAP policies, and application requirements.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Advanced search and filtering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Brand ratings and reviews
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Clear partnership requirements
                </li>
              </ul>
              <Button size="lg" variant="outline">
                Start Exploring Brands
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="order-first lg:order-last">
              <ResellerBrandsPortal />
            </div>
          </div>

          <FlowArrow />

          {/* Step 2: Brand Review & Approval */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold">Smart Application Review</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Brands receive comprehensive reseller applications with verified business 
                credentials, sales history, and marketplace performance metrics. Our intelligent 
                matching system helps brands identify the most qualified partners based on 
                their specific criteria and market presence.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Verified business credentials
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Performance analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  One-click approval system
                </li>
              </ul>
              <Button size="lg" variant="outline">
                Join as a Brand
                <Building2 className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div>
              <BrandApplicationsPortal />
            </div>
          </div>

          <FlowArrow />

          {/* Step 3: Instant Notifications & Partnership */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  3
                </div>
                <h3 className="text-2xl font-bold">Instant Partnership Activation</h3>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Approved resellers receive immediate notifications and gain instant access 
                to brand catalogs, wholesale pricing, and ordering systems. The partnership 
                becomes active within minutes, enabling seamless business growth and 
                streamlined operations from day one.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Instant catalog access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Automated onboarding
                </li>
              </ul>
              <Button size="lg" className="bg-gradient-to-r from-crystal-blue to-ai-neural text-white">
                Get Started Today
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="order-first lg:order-last">
              <ResellerNotificationsPortal />
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
            <p className="text-muted-foreground">Active Partnerships</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">$2.5M+</div>
            <p className="text-muted-foreground">Monthly GMV</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortalPreviewSection;