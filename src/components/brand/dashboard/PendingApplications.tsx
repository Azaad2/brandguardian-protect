
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const PendingApplications = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pending Applications</CardTitle>
          <CardDescription>Recent reseller applications awaiting review</CardDescription>
        </div>
        <Link to="/brand/dashboard/resellers">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Company</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Budget</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">Acme Distribution</div>
                    <div className="text-xs text-muted-foreground">contact@acmedist.com</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">Apr 10, 2023</td>
                <td className="px-4 py-3 text-muted-foreground">$25k-$50k</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8">View</Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="h-8">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium">Peak Distribution</div>
                    <div className="text-xs text-muted-foreground">wholesale@peakdist.com</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">Apr 01, 2023</td>
                <td className="px-4 py-3 text-muted-foreground">$5k-$10k</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="h-8">View</Button>
                    <Button variant="outline" size="sm" className="h-8">
                      <X className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="h-8">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingApplications;
