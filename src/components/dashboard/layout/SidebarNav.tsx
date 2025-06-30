
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
        "fixed left-0 top-0 z-50 h-screen border-r border-gray-200/60 bg-white/95 backdrop-blur transition-all duration-300 lg:static lg:z-0 shadow-xl lg:shadow-sm",
        isOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16"
      )}
    >
      {/* Sidebar Header */}
      <div className={cn(
        "flex h-14 items-center border-b border-gray-100/80 px-4 bg-white",
        !isOpen && "lg:justify-center lg:px-3"
      )}>
        <Link 
          to="/" 
          className={cn(
            "flex items-center",
            !isOpen && "lg:justify-center"
          )}
        >
          {isOpen ? (
            <BndBoxLogo />
          ) : (
            <div className="bg-bndbox-primary rounded-lg p-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="#FF9900"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 7H17"
                  stroke="#FF9900"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 12H17"
                  stroke="#FF9900"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 17H13"
                  stroke="#FF9900"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto lg:hidden h-8 w-8 text-gray-600 hover:bg-gray-100" 
          onClick={toggleSidebar}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 bg-gradient-to-b from-gray-50/50 to-white">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                active
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20" 
                  : "text-gray-700 hover:text-blue-700 hover:bg-blue-50/70",
                !isOpen && "lg:justify-center lg:px-2 lg:py-3"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110", 
                !isOpen && "lg:h-6 lg:w-6",
                active ? "text-white" : "text-gray-600 group-hover:text-blue-600"
              )} />
              {isOpen && (
                <div className="ml-3 flex flex-1 items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  {item.badge && (
                    <Badge 
                      variant={active ? "secondary" : "outline"} 
                      className="ml-auto text-xs font-medium bg-white/20 text-current border-current/20"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="border-t border-gray-100/80 p-3 bg-gray-50/50">
        <LogoutButton userRole={userRole} sidebarOpen={isOpen} />
      </div>
    </aside>
  );
};

export default SidebarNav;
