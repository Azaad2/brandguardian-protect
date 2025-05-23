
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  Check,
  ShieldCheck,
  X,
} from 'lucide-react';

const RecentActivities = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest events and notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Check className="h-4 w-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">New reseller approved</p>
              <p className="text-xs text-muted-foreground">Summit Retail has been approved</p>
            </div>
            <div className="text-xs text-muted-foreground">2h ago</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <X className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">MAP violation detected</p>
              <p className="text-xs text-muted-foreground">Premium Skincare Collection on Amazon</p>
            </div>
            <div className="text-xs text-muted-foreground">5h ago</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Content issue resolved</p>
              <p className="text-xs text-muted-foreground">Product description updated</p>
            </div>
            <div className="text-xs text-muted-foreground">1d ago</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Unauthorized seller detected</p>
              <p className="text-xs text-muted-foreground">ValuSellers on eBay</p>
            </div>
            <div className="text-xs text-muted-foreground">1d ago</div>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" size="sm">View all activities</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
