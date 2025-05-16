
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface TopBarProps {
  toggleSidebar: () => void;
  userRole: UserRole;
  pendingApplicationsCount?: number;
}

const TopBar = ({ toggleSidebar, userRole, pendingApplicationsCount = 0 }: TopBarProps) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu size={20} />
      </Button>
      <div className="ml-auto flex items-center space-x-4">
        {userRole === 'admin' && (
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/reseller-registration">
              <Bell className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Applications</span>
              {pendingApplicationsCount > 0 && (
                <Badge variant="destructive" className="ml-2">{pendingApplicationsCount}</Badge>
              )}
            </Link>
          </Button>
        )}
        <Button variant="ghost" size="sm">
          <span className="hidden sm:inline">{userRole === 'brand' ? 'Brand' : userRole === 'admin' ? 'Admin' : 'Reseller'} Account</span>
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
