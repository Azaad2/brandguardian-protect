
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Mail, Calendar, Building } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { UserProfile } from './types';
import UserActionsDropdown from './UserActionsDropdown';

interface UsersTableProps {
  users: UserProfile[];
  onViewDetails: (user: UserProfile) => void;
  onUserAction: (userId: string, action: string, user: UserProfile) => void;
}

const UsersTable = ({ users, onViewDetails, onUserAction }: UsersTableProps) => {
  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'brand':
        return 'bg-blue-100 text-blue-800';
      case 'reseller':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (status === 'suspended') {
      return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Active</Badge>;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Details</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{user.full_name || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                  {user.bio && (
                    <div className="text-xs text-muted-foreground max-w-xs truncate">
                      {user.bio}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">{user.company_name || 'N/A'}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`${getRoleBadgeColor(user.user_role)}`}>
                  {user.user_role || 'N/A'}
                </Badge>
              </TableCell>
              <TableCell>
                {getStatusBadge(user.status)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewDetails(user)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                  <UserActionsDropdown user={user} onAction={onUserAction} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
