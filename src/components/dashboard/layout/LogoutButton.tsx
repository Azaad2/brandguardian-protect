
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/auth';

interface LogoutButtonProps {
  userRole: UserRole;
  sidebarOpen: boolean;
}

const LogoutButton = ({ userRole, sidebarOpen }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage authentication flag
    localStorage.removeItem('brand_authenticated');
    
    // Show toast message
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
      duration: 3000,
    });
    
    // Navigate to login
    navigate(`/${userRole}/login`);
  };

  return (
    <div className="absolute bottom-4 w-full px-2">
      <Button
        variant="ghost"
        className={cn(
          "flex w-full items-center justify-start px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50",
          !sidebarOpen && "lg:justify-center lg:px-0"
        )}
        onClick={handleLogout}
      >
        <LogOut className={cn("h-5 w-5", !sidebarOpen && "lg:h-6 lg:w-6")} />
        {sidebarOpen && <span className="ml-3 lg:inline">Logout</span>}
      </Button>
    </div>
  );
};

export default LogoutButton;
