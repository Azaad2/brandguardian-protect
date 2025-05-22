
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from './layout/SidebarNav';
import TopBar from './layout/TopBar';
import { brandNavItems, resellerNavItems, adminNavItems } from './data/navItems';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { NavItem } from './types';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  // Determine which nav items to use based on the current URL path
  const getNavItemsFromPath = (): { navItems: NavItem[], userRole: UserRole } => {
    const path = location.pathname;
    
    if (path.startsWith('/brand')) {
      return { navItems: brandNavItems, userRole: 'brand' };
    }
    if (path.startsWith('/admin')) {
      return { navItems: adminNavItems, userRole: 'admin' };
    }
    
    // Default to reseller
    return { navItems: resellerNavItems, userRole: 'reseller' };
  };
  
  // Get the appropriate nav items for the current path
  const { navItems, userRole } = getNavItemsFromPath();

  // Close sidebar on mobile when route changes
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  // Fetch pending applications count for admin users
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (userRole === 'admin') {
        try {
          const { data, error } = await supabase
            .from('reseller_applications')
            .select('id')
            .eq('status', 'pending');
            
          if (error) {
            console.error('Error fetching pending applications count:', error);
            return;
          }
          
          setPendingCount(data?.length || 0);
        } catch (error) {
          console.error('Error in pendingCount fetch:', error);
        }
      }
    };
    
    fetchPendingCount();
    
    // Set up subscription for real-time updates if admin
    if (userRole === 'admin') {
      const channel = supabase
        .channel('reseller-applications-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'reseller_applications' }, 
          () => {
            // Refetch count when any changes happen
            fetchPendingCount();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userRole]);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar 
        toggleSidebar={toggleSidebar} 
        userRole={userRole} 
        pendingApplicationsCount={pendingCount} 
      />
      <div className="flex flex-1">
        <SidebarNav
          isOpen={isMobile ? isOpen : true}
          setIsOpen={setIsOpen}
          navItems={navItems}
          userRole={userRole}
        />
        <main className="flex-1 bg-slate-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
