
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EditUserDialog from '@/components/admin/EditUserDialog';
import ConfirmActionDialog from '@/components/admin/ConfirmActionDialog';
import UserSummaryCards from '@/components/admin/user-management/UserSummaryCards';
import UserSearchAndFilter from '@/components/admin/user-management/UserSearchAndFilter';
import UsersTable from '@/components/admin/user-management/UsersTable';
import UserDetailsDialog from '@/components/admin/user-management/UserDetailsDialog';
import { useUserData } from '@/components/admin/user-management/useUserData';
import { useUserActions } from '@/components/admin/user-management/useUserActions';
import type { UserProfile, ResellerApplication, ConfirmActionState } from '@/components/admin/user-management/types';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDetails, setUserDetails] = useState<ResellerApplication | null>(null);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmActionState>({
    open: false,
    title: '',
    description: '',
    confirmText: '',
    action: () => {},
  });

  const { users, isLoading, refetch, fetchUserDetails } = useUserData();
  const { handleSuspendUser, handleActivateUser, handleDeleteUser } = useUserActions();

  // Filter users based on search and role
  const filteredUsers = users?.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.user_role === selectedRole;
    
    return matchesSearch && matchesRole;
  }) || [];

  const handleViewDetails = async (user: UserProfile) => {
    setSelectedUser(user);
    if (user.user_role === 'reseller') {
      const details = await fetchUserDetails(user.id, user.user_role);
      setUserDetails(details);
    } else {
      setUserDetails(null);
    }
    setIsDetailsDialogOpen(true);
  };

  const handleEditUser = (user: UserProfile) => {
    console.log('Opening edit dialog for user:', user.id);
    setEditUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUserAction = (userId: string, action: string, user: UserProfile) => {
    console.log(`Action ${action} for user ${userId}`);
    
    switch (action) {
      case 'edit':
        handleEditUser(user);
        break;
      case 'suspend':
        if (user.status === 'suspended') {
          setConfirmAction({
            open: true,
            title: 'Activate User',
            description: `Are you sure you want to activate ${user.email}? They will regain access to the platform.`,
            confirmText: 'Activate',
            action: async () => {
              const success = await handleActivateUser(userId, user.email);
              if (success) refetch();
            },
          });
        } else {
          setConfirmAction({
            open: true,
            title: 'Suspend User',
            description: `Are you sure you want to suspend ${user.email}? They will lose access to the platform.`,
            confirmText: 'Suspend',
            action: async () => {
              const success = await handleSuspendUser(userId, user.email);
              if (success) refetch();
            },
            variant: 'destructive',
          });
        }
        break;
      case 'delete':
        setConfirmAction({
          open: true,
          title: 'Delete User',
          description: `Are you sure you want to delete ${user.email}? This action cannot be undone and will remove all user data.`,
          confirmText: 'Delete',
          action: async () => {
            const success = await handleDeleteUser(userId, user.email);
            if (success) refetch();
          },
          variant: 'destructive',
        });
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all platform users including resellers and brands
        </p>
      </div>

      {/* Summary Cards */}
      <UserSummaryCards users={users || []} filteredUsers={filteredUsers} />

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Search and filter all platform users with complete details</CardDescription>
        </CardHeader>
        <CardContent>
          <UserSearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            onRefresh={refetch}
          />

          {/* Users Table */}
          <UsersTable
            users={filteredUsers}
            onViewDetails={handleViewDetails}
            onUserAction={handleUserAction}
          />

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {users?.length === 0 ? 'No users found in database.' : 'No users found matching your criteria.'}
              </p>
              <Button onClick={() => refetch()} variant="outline" className="mt-2">
                Refresh Data
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditUserDialog
        user={editUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUserUpdated={refetch}
      />

      <UserDetailsDialog
        user={selectedUser}
        userDetails={userDetails}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />

      <ConfirmActionDialog
        open={confirmAction.open}
        onOpenChange={(open) => setConfirmAction({ ...confirmAction, open })}
        title={confirmAction.title}
        description={confirmAction.description}
        confirmText={confirmAction.confirmText}
        onConfirm={confirmAction.action}
        variant={confirmAction.variant}
      />
    </div>
  );
};

export default UserManagement;
