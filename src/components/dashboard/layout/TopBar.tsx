
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/auth';

interface TopBarProps {
  toggleSidebar: () => void;
  userRole: UserRole;
}

const TopBar = ({ toggleSidebar, userRole }: TopBarProps) => {
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
        <Button variant="outline" size="sm">
          <Bell className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Notifications</span>
        </Button>
        <Button variant="ghost" size="sm">
          <span className="hidden sm:inline">{userRole === 'brand' ? 'Brand' : 'Reseller'} Account</span>
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
