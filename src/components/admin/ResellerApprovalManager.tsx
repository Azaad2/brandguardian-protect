
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Loader2, FileText, Download } from 'lucide-react';
import { useResellerApproval } from '@/hooks/use-reseller-approval';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ResellerApprovalManager = () => {
  const { applications, loading, approveApplication, rejectApplication, refreshApplications } = useResellerApproval();

  console.log('🔍 ResellerApprovalManager - Applications:', applications);
  console.log('🔍 ResellerApprovalManager - Loading:', loading);

  const downloadDocument = async (documentPath: string, companyName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(documentPath);

      if (error) {
        console.error('Error downloading document:', error);
        toast({
          variant: 'destructive',
          title: 'Download failed',
          description: 'Failed to download document. Please try again.',
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${companyName}_verification_document`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Document downloaded',
        description: 'Verification document has been downloaded successfully.',
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Failed to download document. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Filter for pending applications specifically
  const pendingApplications = applications.filter(app => app.status === 'pending');
  console.log('🔍 Pending applications:', pendingApplications);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reseller Approvals</h2>
          <p className="text-muted-foreground">
            Review and approve pending reseller applications ({applications.length} total, {pendingApplications.length} pending)
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
              <p className="text-muted-foreground">No applications found</p>
              <p className="text-sm text-muted-foreground mt-2">
                This could mean applications exist but aren't being fetched properly
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Show all applications for debugging */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Total applications found: {applications.length}</p>
              <p className="text-sm">Pending applications: {pendingApplications.length}</p>
              <div className="mt-2 space-y-1">
                {applications.map(app => (
                  <div key={app.id} className="text-xs">
                    {app.email} - Status: {app.status} - Created: {new Date(app.created_at).toLocaleDateString()}
                    {(app as any).document_path && <span className="text-green-600 ml-2">📄 Document</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{app.company_name}</CardTitle>
                      <CardDescription>{app.email}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {(app as any).document_path && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadDocument((app as any).document_path, app.company_name)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Document
                        </Button>
                      )}
                      <Badge variant={app.status === 'pending' ? 'default' : app.status === 'approved' ? 'secondary' : 'destructive'}>
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Applied {formatDistanceToNow(new Date(app.created_at))} ago
                      </p>
                      {!(app as any).document_path && (
                        <p className="text-sm text-amber-600">
                          ⚠️ No verification document uploaded
                        </p>
                      )}
                    </div>
                    {app.status === 'pending' && (
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
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResellerApprovalManager;
