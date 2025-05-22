
import { useState } from 'react';
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

  // Completely rewritten isActive function to fix navigation issues
  const isActive = (href: string) => {
    // Get context ("brand", "reseller", "admin") from both paths
    const hrefSegments = href.split('/');
    const pathSegments = location.pathname.split('/');
    const hrefContext = hrefSegments[1]; // "brand", "reseller", etc
    const pathContext = pathSegments[1]; // Current context
    
    // First check if we're even in the same portal (brand vs reseller vs admin)
    if (hrefContext !== pathContext) {
      return false;
    }
    
    // Exact match for root dashboard pages
    if (href === `/${hrefContext}/dashboard` && location.pathname === href) {
      return true;
    }
    
    // For nested routes, check if the current path starts with the nav item path
    // But make sure the next segment matches too to prevent partial matches
    if (href !== `/${hrefContext}/dashboard`) {
      // For non-root items, we need more specific matching
      // Make sure we're matching the specific section (e.g., /brand/dashboard/inventory)
      const hrefSection = href.split('/')[3]; // The section part: inventory, orders, etc.
      const pathSection = pathSegments[3]; // Current section
      
      return hrefSection === pathSection;
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

      {/* Navigation */}
      <nav className="space-y-1 px-2 py-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100 hover:text-slate-900",
              isActive(item.href) 
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
        ))}
      </nav>
    </aside>
  );
};

export default SidebarNav;
