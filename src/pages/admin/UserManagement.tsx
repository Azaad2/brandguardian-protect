
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Users, Search, Filter, MoreHorizontal, Mail, Phone, Calendar, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  user_role: string | null;
  created_at: string;
  bio: string | null;
}

interface ResellerApplication {
  id: string;
  company_name: string;
  business_type: string;
  ein_number: string;
  phone: string;
  sales_volume: string;
  wholesale_budget: string;
  product_categories: string[];
  status: string;
  amazon_seller_id: string | null;
  walmart_seller_id: string | null;
  ebay_seller_id: string | null;
  feedback_score: string | null;
  linkedin: string | null;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userDetails, setUserDetails] = useState<ResellerApplication | null>(null);

  // Fetch all users - using direct query for now until RPC function is properly typed
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-all-users'],
    queryFn: async () => {
      console.log('Fetching all users for admin...');
      
      // First verify we're admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Check admin status
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', user.id)
        .single();

      if (profile?.user_role !== 'admin') {
        throw new Error('Not authorized - admin access required');
      }

      // For now, use direct query since RPC function needs to be properly added to types
      // This will work for admin users due to their elevated permissions
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Successfully fetched users:', data);
      return data as UserProfile[];
    },
  });

  // Filter users based on search and role
  const filteredUsers = users?.filter(user => {
    console.log('Filtering user:', user);
    
    // Apply search filter
    const matchesSearch = !searchTerm || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply role filter
    const matchesRole = selectedRole === 'all' || user.user_role === selectedRole;
    
    const shouldInclude = matchesSearch && matchesRole;
    console.log(`User ${user.email}: search=${matchesSearch}, role=${matchesRole}, included=${shouldInclude}`);
    
    return shouldInclude;
  }) || [];

  console.log('Filtered users:', filteredUsers);
  console.log('Total filtered users:', filteredUsers.length);

  // Fetch detailed user information
  const fetchUserDetails = async (userId: string, userRole: string) => {
    if (userRole === 'reseller') {
      const { data, error } = await supabase
        .from('reseller_applications')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching reseller details:', error);
        return null;
      }
      return data;
    }
    return null;
  };

  const handleViewDetails = async (user: UserProfile) => {
    setSelectedUser(user);
    if (user.user_role === 'reseller') {
      const details = await fetchUserDetails(user.id, user.user_role);
      setUserDetails(details);
    } else {
      setUserDetails(null);
    }
  };

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

  const handleUserAction = async (userId: string, action: string) => {
    console.log(`Action ${action} for user ${userId}`);
    // Implement user actions like suspend, activate, etc.
  };

  const resellerCount = filteredUsers.filter(u => u.user_role === 'reseller').length;
  const brandCount = filteredUsers.filter(u => u.user_role === 'brand').length;
  const adminCount = filteredUsers.filter(u => u.user_role === 'admin').length;

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

      {/* Debug Information */}
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">
          Debug Info: Total users in DB: {users?.length || 0} | Filtered users: {filteredUsers.length}
        </p>
        <p className="text-sm text-yellow-800">
          Search term: "{searchTerm}" | Selected role: {selectedRole}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Filtered: {filteredUsers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resellers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resellerCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brands</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Search and filter all platform users with complete details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All Roles</option>
                <option value="reseller">Resellers</option>
                <option value="brand">Brands</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            <Button onClick={() => refetch()} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                              onClick={() => handleViewDetails(user)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>
                                Complete information for {selectedUser?.email}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                    <p className="font-medium">{selectedUser.full_name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <p className="font-medium">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                                    <p className="font-medium">{selectedUser.company_name || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <Badge className={`${getRoleBadgeColor(selectedUser.user_role)}`}>
                                      {selectedUser.user_role || 'N/A'}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Joined</label>
                                    <p className="font-medium">{new Date(selectedUser.created_at).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                                    <p className="font-mono text-xs">{selectedUser.id}</p>
                                  </div>
                                </div>

                                {selectedUser.bio && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Bio</label>
                                    <p className="mt-1">{selectedUser.bio}</p>
                                  </div>
                                )}

                                {/* Reseller Specific Details */}
                                {selectedUser.user_role === 'reseller' && userDetails && (
                                  <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Reseller Application Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                                        <p className="font-medium">{userDetails.business_type}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">EIN Number</label>
                                        <p className="font-medium">{userDetails.ein_number}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                        <p className="font-medium">{userDetails.phone}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Sales Volume</label>
                                        <p className="font-medium">{userDetails.sales_volume}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Wholesale Budget</label>
                                        <p className="font-medium">{userDetails.wholesale_budget}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                                        <Badge className={userDetails.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                          {userDetails.status}
                                        </Badge>
                                      </div>
                                    </div>

                                    {/* Marketplace IDs */}
                                    <div className="mt-4">
                                      <label className="text-sm font-medium text-muted-foreground">Marketplace IDs</label>
                                      <div className="grid grid-cols-1 gap-2 mt-2">
                                        {userDetails.amazon_seller_id && (
                                          <div className="flex justify-between">
                                            <span>Amazon:</span>
                                            <span className="font-mono text-sm">{userDetails.amazon_seller_id}</span>
                                          </div>
                                        )}
                                        {userDetails.walmart_seller_id && (
                                          <div className="flex justify-between">
                                            <span>Walmart:</span>
                                            <span className="font-mono text-sm">{userDetails.walmart_seller_id}</span>
                                          </div>
                                        )}
                                        {userDetails.ebay_seller_id && (
                                          <div className="flex justify-between">
                                            <span>eBay:</span>
                                            <span className="font-mono text-sm">{userDetails.ebay_seller_id}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Product Categories */}
                                    <div className="mt-4">
                                      <label className="text-sm font-medium text-muted-foreground">Product Categories</label>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {userDetails.product_categories?.map((category, index) => (
                                          <Badge key={index} variant="outline" className="text-xs">
                                            {category}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {userDetails.feedback_score && (
                                      <div className="mt-4">
                                        <label className="text-sm font-medium text-muted-foreground">Feedback Score</label>
                                        <p className="font-medium">{userDetails.feedback_score}</p>
                                      </div>
                                    )}

                                    {userDetails.linkedin && (
                                      <div className="mt-4">
                                        <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                                        <a 
                                          href={userDetails.linkedin} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {userDetails.linkedin}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'edit')}>
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'suspend')}>
                              Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, 'delete')}>
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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
    </div>
  );
};

export default UserManagement;
