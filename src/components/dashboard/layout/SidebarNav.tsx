
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { cn } from '@/lib/utils';
import { NavItem } from '../types';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/auth';

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
        "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-all duration-300 lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4">
        <Link 
          to="/" 
          className={cn(
            "flex items-center",
            !isOpen && "lg:justify-center"
          )}
        >
          <BndBoxLogo className={cn("h-8 w-auto", !isOpen && "lg:h-10")} />
          {isOpen && <span className="ml-2 text-xl font-semibold lg:inline">BndBox</span>}
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

      {/* Navigation - Fixed using <Link> instead of <a> tags */}
      <nav className="space-y-1 px-2 py-4">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-900",
                active
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-700",
                !isOpen && "lg:justify-center lg:px-0"
              )}
            >
              <item.icon className={cn("h-5 w-5", !isOpen && "lg:h-6 lg:w-6")} />
              {isOpen && (
                <div className="ml-3 flex flex-1 items-center justify-between lg:inline">
                  <span>{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarNav;
