
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
          return;
        }

        if (data?.company_name) {
          setCompanyName(data.company_name);
        }
      } catch (err) {
        // Silent error handling
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
        return companyName || 'Reseller Portal';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200/60 bg-white/95 backdrop-blur px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {userRole === 'admin' && pendingApplicationsCount !== undefined && pendingApplicationsCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full">
            <Bell className="h-4 w-4 text-red-600" />
            <Badge variant="destructive" className="text-xs font-semibold">
              {pendingApplicationsCount}
            </Badge>
          </div>
        )}
        <div className="text-right hidden sm:block">
          <h2 className="text-sm font-semibold text-gray-900">
            {getDisplayText()}
          </h2>
          <p className="text-xs text-gray-500">Welcome back</p>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
