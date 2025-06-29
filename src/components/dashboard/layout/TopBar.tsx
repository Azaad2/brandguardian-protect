
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
    <header className="flex h-12 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-8 w-8"
          onClick={toggleSidebar}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {userRole === 'admin' && pendingApplicationsCount !== undefined && pendingApplicationsCount > 0 && (
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-gray-600" />
            <Badge variant="destructive" className="text-xs font-medium">
              {pendingApplicationsCount}
            </Badge>
          </div>
        )}
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {getDisplayText()}
        </span>
      </div>
    </header>
  );
};

export default TopBar;
