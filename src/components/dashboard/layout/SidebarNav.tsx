
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BndBoxLogo from '@/components/branding/BndBoxLogo';
import { cn } from '@/lib/utils';
import { NavItem } from '../types';
import { Badge } from '@/components/ui/badge';

interface SidebarNavProps {
  navItems: NavItem[];
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarNav = ({ navItems, sidebarOpen, toggleSidebar }: SidebarNavProps) => {
  const location = useLocation();

  // Check if a navigation item is active
  const isActive = (path: string) => {
    if (path.endsWith('/dashboard')) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
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
    </aside>
  );
};

export default SidebarNav;
