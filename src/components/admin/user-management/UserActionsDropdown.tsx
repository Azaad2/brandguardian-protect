
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import type { UserProfile } from './types';

interface UserActionsDropdownProps {
  user: UserProfile;
  onAction: (userId: string, action: string, user: UserProfile) => void;
}

const UserActionsDropdown = ({ user, onAction }: UserActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAction(user.id, 'edit', user)}>
          Edit User
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAction(user.id, 'suspend', user)}>
          {user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onAction(user.id, 'delete', user)}
          className="text-red-600 focus:text-red-600"
        >
          Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserActionsDropdown;
