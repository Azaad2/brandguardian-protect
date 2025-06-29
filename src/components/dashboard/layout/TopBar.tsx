
import { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';

interface TopBarProps {
  toggleSidebar: () => void;
  userRole: UserRole;
  pendingApplicationsCount?: number;
}

const TopBar = ({ toggleSidebar, userRole, pendingApplicationsCount }: TopBarProps) => {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState<string>('');

  useEffect(() => {
    const fetchCompanyName = async () => {
      if (!user || userRole !== 'reseller') return;

      try {
        const { data, error } = await supabase
          .from('reseller_applications')
          .select('company_name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching company name:', error);
          return;
        }

        if (data?.company_name) {
          setCompanyName(data.company_name);
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    fetchCompanyName();
  }, [user, userRole]);

  const getDisplayText = () => {
    switch (userRole) {
      case 'admin':
        return 'Admin Portal';
      case 'brand':
        return 'Brand Portal';
      case 'reseller':
        return companyName || 'Reseller Account';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex h-16 sm:h-18 items-center justify-between border-b bg-white px-4 sm:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-10 w-10"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {userRole === 'admin' && pendingApplicationsCount !== undefined && pendingApplicationsCount > 0 && (
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <Badge variant="destructive" className="font-semibold">
              {pendingApplicationsCount}
            </Badge>
          </div>
        )}
        <span className="text-sm sm:text-base font-semibold text-gray-700 hidden sm:block">
          {getDisplayText()}
        </span>
      </div>
    </header>
  );
};

export default TopBar;
