
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useResellerApproval } from '@/hooks/use-reseller-approval';
import { formatDistanceToNow } from 'date-fns';

const ResellerApprovalManager = () => {
  const { applications, loading, approveApplication, rejectApplication, refreshApplications } = useResellerApproval();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reseller Approvals</h2>
          <p className="text-muted-foreground">
            Review and approve pending reseller applications
          </p>
        </div>
        <Button variant="outline" onClick={refreshApplications}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {applications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending applications</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{app.company_name}</CardTitle>
                    <CardDescription>{app.email}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Applied {formatDistanceToNow(new Date(app.created_at))} ago
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => approveApplication(app.id, app.email)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectApplication(app.id, app.email)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResellerApprovalManager;
