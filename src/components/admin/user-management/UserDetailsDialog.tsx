
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { UserProfile, ResellerApplication } from './types';

interface UserDetailsDialogProps {
  user: UserProfile | null;
  userDetails: ResellerApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UserDetailsDialog = ({ user, userDetails, open, onOpenChange }: UserDetailsDialogProps) => {
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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information for {user.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="font-medium">{user.full_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Company</label>
              <p className="font-medium">{user.company_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <Badge className={`${getRoleBadgeColor(user.user_role)}`}>
                {user.user_role || 'N/A'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              {getStatusBadge(user.status)}
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Joined</label>
              <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">User ID</label>
              <p className="font-mono text-xs">{user.id}</p>
            </div>
          </div>

          {user.bio && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Bio</label>
              <p className="mt-1">{user.bio}</p>
            </div>
          )}

          {/* Reseller Specific Details */}
          {user.user_role === 'reseller' && userDetails && (
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
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
