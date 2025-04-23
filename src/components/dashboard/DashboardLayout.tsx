
import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Bell, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ShoppingBag,
  FileBarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/auth';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
}

const BrandNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/brand/dashboard' },
  { icon: Users, label: 'Resellers', path: '/brand/dashboard/resellers', badge: '3' },
  { icon: Package, label: 'Inventory', path: '/brand/dashboard/inventory' },
  { icon: ShoppingBag, label: 'Listings', path: '/brand/dashboard/listings' },
  { icon: ShoppingCart, label: 'Orders', path: '/brand/dashboard/orders' },
  { icon: ShieldCheck, label: 'Compliance', path: '/brand/dashboard/compliance', badge: '2' },
  { icon: Bell, label: 'Alerts', path: '/brand/dashboard/alerts' },
  { icon: MessageSquare, label: 'Messages', path: '/brand/dashboard/messages', badge: '5' },
  { icon: BarChart3, label: 'Analytics', path: '/brand/dashboard/analytics' },
  { icon: FileBarChart, label: 'Reports', path: '/brand/dashboard/reports' },
  { icon: Settings, label: 'Settings', path: '/brand/dashboard/settings' },
];

const ResellerNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/reseller/dashboard' },
  { icon: Package, label: 'Brands', path: '/reseller/dashboard/brands' },
  { icon: ShoppingCart, label: 'Orders', path: '/reseller/dashboard/orders' },
  { icon: Bell, label: 'Shipments', path: '/reseller/dashboard/shipments' },
  { icon: MessageSquare, label: 'Messages', path: '/reseller/dashboard/messages' },
  { icon: BarChart3, label: 'Analytics', path: '/reseller/dashboard/analytics' },
  { icon: Settings, label: 'Settings', path: '/reseller/dashboard/settings' },
];

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = userRole === 'brand' ? BrandNavItems : ResellerNavItems;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Clear local storage authentication flag
    localStorage.removeItem('brand_authenticated');
    
    // Show toast message
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
      duration: 3000,
    });
    
    // Navigate to login
    navigate(`/${userRole}/login`);
  };

  // Check if a navigation item is active
  const isActive = (path: string) => {
    if (path === '/brand/dashboard' || path === '/reseller/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-all duration-300 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link 
            to="/" 
            className={cn(
              "flex items-center",
              !sidebarOpen && "lg:justify-center"
            )}
          >
            <BndBoxLogo className={cn("h-8 w-auto", !sidebarOpen && "lg:h-10")} />
            {sidebarOpen && <span className="ml-2 text-xl font-semibold lg:inline">BndBox</span>}
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={toggleSidebar}
          >
            <X size={20} />
          </Button>
        </div>
        <Separator />

        {/* Navigation */}
        <nav className="space-y-1 px-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-900",
                isActive(item.path) 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-700",
                !sidebarOpen && "lg:justify-center lg:px-0"
              )}
            >
              <item.icon className={cn("h-5 w-5", !sidebarOpen && "lg:h-6 lg:w-6")} />
              {sidebarOpen && (
                <div className="ml-3 flex flex-1 items-center justify-between lg:inline">
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 w-full px-2">
          <Button
            variant="ghost"
            className={cn(
              "flex w-full items-center justify-start px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50",
              !sidebarOpen && "lg:justify-center lg:px-0"
            )}
            onClick={handleLogout}
          >
            <LogOut className={cn("h-5 w-5", !sidebarOpen && "lg:h-6 lg:w-6")} />
            {sidebarOpen && <span className="ml-3 lg:inline">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </Button>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <span className="hidden sm:inline">{userRole === 'brand' ? 'Brand' : 'Reseller'} Account</span>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
