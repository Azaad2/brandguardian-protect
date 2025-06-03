
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarNav from './layout/SidebarNav';
import TopBar from './layout/TopBar';
import { brandNavItems, resellerNavItems, adminNavItems } from './data/navItems';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { NavItem } from './types';

const DashboardLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  console.log('DashboardLayout rendering with location:', location);

  // Determine which nav items to use based on the current URL path
  const getNavItemsFromPath = (): { navItems: NavItem[], userRole: UserRole } => {
    const path = location.pathname;
    
    console.log('DashboardLayout - Current path:', path);
    console.log('DashboardLayout - Location object:', location);
    
    // Check for admin portal first (most specific)
    if (path.startsWith('/admin')) {
      console.log('Detected admin portal from path:', path);
      return { navItems: adminNavItems, userRole: 'admin' };
    }
    
    // Check for brand portal
    if (path.startsWith('/brand')) {
      console.log('Detected brand portal from path:', path);
      return { navItems: brandNavItems, userRole: 'brand' };
    }
    
    // Check for reseller portal
    if (path.startsWith('/reseller')) {
      console.log('Detected reseller portal from path:', path);
      return { navItems: resellerNavItems, userRole: 'reseller' };
    }
    
    // Legacy fallback for /dashboard routes (default to reseller)
    if (path.startsWith('/dashboard')) {
      console.log('Detected legacy dashboard route, defaulting to reseller. Path:', path);
      return { navItems: resellerNavItems, userRole: 'reseller' };
    }
    
    // If we can't determine from path, log warning and default to reseller
    console.warn('Could not determine portal type from path:', path);
    return { navItems: resellerNavItems, userRole: 'reseller' };
  };
  
  // Get the appropriate nav items for the current path
  const { navItems, userRole } = getNavItemsFromPath();

  console.log('DashboardLayout - Determined userRole:', userRole, 'from path:', location.pathname);
  console.log('DashboardLayout - Using navItems:', navItems);

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

  console.log('DashboardLayout - About to render with userRole:', userRole);
  console.log('DashboardLayout - About to render Outlet');

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
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
