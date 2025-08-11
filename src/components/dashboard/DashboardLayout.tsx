
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarNav from './layout/SidebarNav';
import TopBar from './layout/TopBar';
import { brandNavItems, resellerNavItems, adminNavItems } from './data/navItems';
import { useMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { NavItem } from './types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useMobile();
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const location = useLocation();

  // Determine which nav items to use based on the current URL path
  const getNavItemsFromPath = (): { navItems: NavItem[], userRole: UserRole } => {
    const path = location.pathname;
    
    // Check for admin portal first (most specific)
    if (path.startsWith('/admin')) {
      return { navItems: adminNavItems, userRole: 'admin' };
    }
    
    // Check for brand portal
    if (path.startsWith('/brand')) {
      return { navItems: brandNavItems, userRole: 'brand' };
    }
    
    // Check for reseller portal
    if (path.startsWith('/reseller')) {
      return { navItems: resellerNavItems, userRole: 'reseller' };
    }
    
    // Legacy fallback for /dashboard routes (default to reseller)
    if (path.startsWith('/dashboard')) {
      return { navItems: resellerNavItems, userRole: 'reseller' };
    }
    
    // If we can't determine from path, default to reseller
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
      // Only fetch if user is authenticated and has admin role
      if (userRole === 'admin' && user) {
        try {
          // Verify user has admin role in the database before querying
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_role')
            .eq('id', user.id)
            .single();
            
          if (profile?.user_role === 'admin') {
            const { data, error } = await supabase
              .from('reseller_applications')
              .select('id')
              .eq('status', 'pending');
              
            if (!error && data) {
              setPendingCount(data.length);
            }
          }
        } catch (error) {
          console.error('Error fetching pending count:', error);
          setPendingCount(0);
        }
      } else {
        setPendingCount(0);
      }
    };
    
    fetchPendingCount();
    
    // Set up subscription for real-time updates if admin and authenticated
    if (userRole === 'admin' && user) {
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
  }, [userRole, user]);

  return (
    <div className="flex h-screen w-full bg-gray-50/30 overflow-hidden">
      {/* Sidebar */}
      <SidebarNav
        isOpen={isMobile ? isOpen : true}
        setIsOpen={setIsOpen}
        navItems={navItems}
        userRole={userRole}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar 
          toggleSidebar={toggleSidebar} 
          userRole={userRole} 
          pendingApplicationsCount={pendingCount} 
        />

        {/* Content area with proper scrolling */}
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
