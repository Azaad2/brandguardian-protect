
import { useState } from 'react';
import { useResellerApproval } from '@/hooks/use-reseller-approval';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, FileText, CheckCircle, XCircle, Clock, User, Mail, Phone, Building, Package, DollarSign, Users, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';

interface ResellerApplication {
  id: string;
  user_id: string;
  email: string;
  company_name: string;
  business_type: string;
  ein_number: string;
  phone: string;
  sales_volume: string;
  wholesale_budget: string;
  product_categories: string[];
  status: string;
  application_status: string;
  amazon_seller_id: string | null;
  walmart_seller_id: string | null;
  ebay_seller_id: string | null;
  feedback_score: string | null;
  linkedin: string | null;
  document_path: string | null;
  document_verified: boolean;
  document_verification_notes: string | null;
  document_verified_at: string | null;
  document_verified_by: string | null;
  created_at: string;
  updated_at: string;
}

const ResellerApprovalManager = () => {
  const { applications, loading, approveApplication, rejectApplication, verifyDocument, refreshApplications } = useResellerApproval();
  const [selectedApplication, setSelectedApplication] = useState<ResellerApplication | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const downloadDocument = async (documentPath: string, companyName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(documentPath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName}_verification_document.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'Download started',
        description: 'Verification document is being downloaded.',
      });
    } catch (error) {
      console.error('Error downloading document:', error);
      toast({
        variant: 'destructive',
        title: 'Download failed',
        description: 'Failed to download verification document.',
      });
    }
  };

  const handleVerifyDocument = async (verified: boolean) => {
    if (!selectedApplication) return;

    const success = await verifyDocument(
      selectedApplication.id,
      verified,
      verificationNotes || undefined
    );

    if (success) {
      setVerificationDialogOpen(false);
      setVerificationNotes('');
      setSelectedApplication(null);
    }
  };

  const getStatusBadge = (status: string, applicationStatus: string) => {
    const combinedStatus = applicationStatus || status;
    
    switch (combinedStatus) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" />Pending Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      case 'document_pending':
        return <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800"><FileText className="h-3 w-3" />Document Required</Badge>;
      case 'document_review':
        return <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800"><Eye className="h-3 w-3" />Document Review</Badge>;
      case 'submitted':
        return <Badge variant="outline" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Just Submitted</Badge>;
      default:
        return <Badge variant="outline">{combinedStatus}</Badge>;
    }
  };

  const filterApplications = (applications: ResellerApplication[], filter: string) => {
    switch (filter) {
      case 'pending':
        return applications.filter(app => ['pending', 'document_review'].includes(app.application_status || app.status));
      case 'approved':
        return applications.filter(app => app.status === 'approved');
      case 'rejected':
        return applications.filter(app => app.status === 'rejected');
      case 'no-documents':
        return applications.filter(app => !app.document_path);
      case 'document-pending':
        return applications.filter(app => app.document_path && !app.document_verified);
      default:
        return applications;
    }
  };

  const filteredApplications = filterApplications(applications, activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading reseller applications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reseller Application Management</h2>
          <p className="text-muted-foreground">Review and manage reseller applications with document verification</p>
        </div>
        <Button variant="outline" onClick={refreshApplications}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filterApplications(applications, 'pending').length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({filterApplications(applications, 'approved').length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({filterApplications(applications, 'rejected').length})</TabsTrigger>
          <TabsTrigger value="no-documents">No Docs ({filterApplications(applications, 'no-documents').length})</TabsTrigger>
          <TabsTrigger value="document-pending">Doc Review ({filterApplications(applications, 'document-pending').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredApplications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No applications found</p>
                <p className="text-sm text-muted-foreground">Applications matching your filter will appear here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building className="h-5 w-5" />
                          {application.company_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {application.email}
                          </span>
                          {application.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {application.phone}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status, application.application_status)}
                        <Badge variant="outline" className="text-xs">
                          {formatDistanceToNow(new Date(application.created_at))} ago
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(application.business_type || application.ein_number || application.sales_volume) && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {application.business_type && (
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">Business Type</Label>
                            <p className="text-sm">{application.business_type}</p>
                          </div>
                        )}
                        {application.ein_number && (
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">EIN Number</Label>
                            <p className="text-sm">{application.ein_number}</p>
                          </div>
                        )}
                        {application.sales_volume && (
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">Sales Volume</Label>
                            <p className="text-sm">{application.sales_volume}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {application.product_categories && application.product_categories.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">Product Categories</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {application.product_categories.map((category, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {application.document_path ? (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadDocument(application.document_path!, application.company_name)}
                              className="flex items-center gap-1"
                            >
                              <Download className="h-4 w-4" />
                              Download Document
                            </Button>
                            <Dialog open={verificationDialogOpen && selectedApplication?.id === application.id} onOpenChange={setVerificationDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedApplication(application)}
                                  className="flex items-center gap-1"
                                >
                                  <FileText className="h-4 w-4" />
                                  {application.document_verified ? 'Verified' : 'Verify Document'}
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Document Verification</DialogTitle>
                                  <DialogDescription>
                                    Review and verify the document for {application.company_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="notes">Verification Notes (Optional)</Label>
                                    <Textarea
                                      id="notes"
                                      placeholder="Add any notes about the document verification..."
                                      value={verificationNotes}
                                      onChange={(e) => setVerificationNotes(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleVerifyDocument(false)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject Document
                                  </Button>
                                  <Button
                                    variant="default"
                                    onClick={() => handleVerifyDocument(true)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Verify Document
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            {application.document_verified && (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Document Verified
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            No Document Uploaded
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {application.status === 'pending' && (
                          <>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => rejectApplication(application.id, application.email)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => approveApplication(application.id, application.email)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerApprovalManager;
