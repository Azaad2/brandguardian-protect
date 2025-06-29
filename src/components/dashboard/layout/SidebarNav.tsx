
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { cn } from '@/lib/utils';
import { NavItem } from '../types';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/auth';
import LogoutButton from '@/components/dashboard/layout/LogoutButton'; 

// Updated props interface to match what's being passed
export interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  userRole: UserRole;
}

const SidebarNav = ({ navItems, isOpen, setIsOpen, userRole }: SidebarProps) => {
  const location = useLocation();

  // Close sidebar on mobile when route changes
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Completely rebuilt isActive function with debugging
  const isActive = (href: string) => {
    const currentPath = location.pathname;
    
    // Direct exact match (handles dashboard root pages)
    if (href === currentPath) {
      return true;
    }
    
    // For nested routes within a specific section
    // Extract the portal and section from both the href and current path
    const hrefParts = href.split('/');
    const pathParts = currentPath.split('/');
    
    if (hrefParts.length < 3 || pathParts.length < 3) {
      return false;
    }
    
    // Check if we're in the same portal (brand, reseller, admin)
    const samePortal = hrefParts[1] === pathParts[1];
    if (!samePortal) return false;
    
    // Check if we're on the dashboard page
    const bothOnDashboard = hrefParts[2] === 'dashboard' && pathParts[2] === 'dashboard';
    if (!bothOnDashboard) return false;
    
    // For section-specific pages, match the section (inventory, orders, etc.)
    if (hrefParts.length > 3 && pathParts.length > 3) {
      return hrefParts[3] === pathParts[3];
    }
    
    // If the href is exactly to /[portal]/dashboard and we're on a nested route,
    // don't consider it active
    if (hrefParts.length === 3 && pathParts.length > 3) {
      return false;
    }
    
    return false;
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 lg:static shadow-lg lg:shadow-none",
        isOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        "flex h-16 sm:h-18 items-center border-b border-gray-100 px-6",
        !isOpen && "lg:justify-center lg:px-4"
      )}>
        <Link 
          to="/" 
          className={cn(
            "flex items-center",
            !isOpen && "lg:justify-center"
          )}
        >
          <BndBoxLogo className={cn("h-8 w-auto", !isOpen && "lg:h-10")} />
          {isOpen && (
            <span className="ml-3 text-xl font-bold text-gray-900 lg:hidden">
              BndBox
            </span>
          )}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto lg:hidden h-10 w-10" 
          onClick={toggleSidebar}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="bg-gray-100" />

      {/* Navigation */}
      <nav className="space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all duration-200 hover:bg-gray-50",
                active
                  ? "bg-primary/10 text-primary shadow-sm" 
                  : "text-gray-700 hover:text-gray-900",
                !isOpen && "lg:justify-center lg:px-3 lg:py-4"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 flex-shrink-0", 
                !isOpen && "lg:h-7 lg:w-7"
              )} />
              {isOpen && (
                <div className="ml-4 flex flex-1 items-center justify-between lg:inline">
                  <span className="font-semibold">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto font-medium">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-gray-50">
        <LogoutButton userRole={userRole} sidebarOpen={isOpen} />
      </div>
    </aside>
  );
};

export default SidebarNav;
