
import { ReactNode, useState } from 'react';
import { UserRole } from '@/types/auth';
import SidebarNav from './layout/SidebarNav';
import TopBar from './layout/TopBar';
import LogoutButton from './layout/LogoutButton';
import { BrandNavItems, ResellerNavItems } from './data/navItems';

interface DashboardLayoutProps {
  children: ReactNode;
  userRole: UserRole;
}

const DashboardLayout = ({ children, userRole }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navItems = userRole === 'brand' ? BrandNavItems : ResellerNavItems;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <SidebarNav 
        navItems={navItems} 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          toggleSidebar={toggleSidebar} 
          userRole={userRole} 
        />

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
      
      {/* Logout Button (positioned in sidebar but as a separate component) */}
      <LogoutButton userRole={userRole} sidebarOpen={sidebarOpen} />
    </div>
  );
};

export default DashboardLayout;
