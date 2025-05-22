
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Check, X, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const CatalogApprovals = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCatalog, setSelectedCatalog] = useState<string | null>(null);
  const [selectedResellers, setSelectedResellers] = useState<string[]>([]);

  // Fetch catalogs pending approval
  const { data: pendingCatalogs, isLoading: loadingCatalogs } = useQuery({
    queryKey: ['pending-catalogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_uploads')
        .select('*, profiles:brand_id(company_name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch approved catalogs
  const { data: approvedCatalogs, isLoading: loadingApproved } = useQuery({
    queryKey: ['approved-catalogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_uploads')
        .select('*, profiles:brand_id(company_name)')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch resellers
  const { data: resellers, isLoading: loadingResellers } = useQuery({
    queryKey: ['resellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_role', 'reseller');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Handle catalog approval/rejection
  const updateCatalogStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('product_uploads')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      return { id, status };
    },
    onSuccess: (data) => {
      toast({
        title: `Catalog ${data.status}`,
        description: `The catalog has been ${data.status}.`,
      });
      // Refresh catalogs lists
      queryClient.invalidateQueries({ queryKey: ['pending-catalogs'] });
      queryClient.invalidateQueries({ queryKey: ['approved-catalogs'] });
    },
    onError: (error: any) => {
      toast({
        title: "Action failed",
        description: error.message || "Failed to update catalog status.",
        variant: "destructive",
      });
    }
  });

  // Toggle reseller access to a catalog
  const toggleResellerAccess = async (resellerId: string, hasAccess: boolean) => {
    if (!selectedCatalog) return;
    
    try {
      if (hasAccess) {
        // Add reseller to access list
        setSelectedResellers(prev => [...prev, resellerId]);
        
        // Here you would update the database to grant access
        // This is a simplified version, you'd need to implement
        // the actual database relation between resellers and catalogs
        toast({
          title: "Access granted",
          description: "Reseller now has access to this catalog.",
        });
      } else {
        // Remove reseller from access list
        setSelectedResellers(prev => prev.filter(id => id !== resellerId));
        
        // Here you would update the database to revoke access
        toast({
          title: "Access revoked",
          description: "Reseller's access has been revoked.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message || "Failed to update access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Catalog Management</h1>
        <p className="text-muted-foreground">Approve catalogs and manage reseller access</p>
      </div>
      
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved Catalogs</TabsTrigger>
          <TabsTrigger value="access">Reseller Access</TabsTrigger>
        </TabsList>
        
        {/* Pending Catalogs Tab */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Catalogs</CardTitle>
              <CardDescription>
                Review and approve catalogs submitted by brands
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCatalogs ? (
                <div className="text-center py-8">Loading pending catalogs...</div>
              ) : pendingCatalogs && pendingCatalogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Catalog Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Submission Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingCatalogs.map((catalog: any) => (
                      <TableRow key={catalog.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            {catalog.name}
                          </div>
                        </TableCell>
                        <TableCell>{catalog.profiles?.company_name || "Unknown Brand"}</TableCell>
                        <TableCell>{new Date(catalog.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              variant="ghost"
                              asChild
                            >
                              <a href={catalog.file_url} target="_blank" rel="noopener noreferrer">View</a>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600"
                              onClick={() => updateCatalogStatus.mutate({ id: catalog.id, status: 'approved' })}
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600"
                              onClick={() => updateCatalogStatus.mutate({ id: catalog.id, status: 'rejected' })}
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No pending catalogs</h3>
                    <p className="text-muted-foreground mt-1">
                      All catalogs have been reviewed.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Approved Catalogs Tab */}
        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Catalogs</CardTitle>
              <CardDescription>
                View all catalogs that have been approved
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingApproved ? (
                <div className="text-center py-8">Loading approved catalogs...</div>
              ) : approvedCatalogs && approvedCatalogs.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Catalog Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Approval Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedCatalogs.map((catalog: any) => (
                      <TableRow key={catalog.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            {catalog.name}
                          </div>
                        </TableCell>
                        <TableCell>{catalog.profiles?.company_name || "Unknown Brand"}</TableCell>
                        <TableCell>{new Date(catalog.updated_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm"
                              variant="ghost"
                              asChild
                            >
                              <a href={catalog.file_url} target="_blank" rel="noopener noreferrer">View</a>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedCatalog(catalog.id)}
                            >
                              <Users className="h-4 w-4 mr-1" /> Manage Access
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
                  <div className="text-center">
                    <h3 className="text-lg font-medium">No approved catalogs</h3>
                    <p className="text-muted-foreground mt-1">
                      No catalogs have been approved yet.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reseller Access Tab */}
        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Manage Reseller Access</CardTitle>
              <CardDescription>
                Control which resellers can access which catalogs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="catalog-select">Select Catalog</Label>
                  <Select 
                    value={selectedCatalog || ""}
                    onValueChange={setSelectedCatalog}
                  >
                    <SelectTrigger id="catalog-select">
                      <SelectValue placeholder="Select a catalog" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingApproved ? (
                        <SelectItem value="loading" disabled>Loading catalogs...</SelectItem>
                      ) : approvedCatalogs && approvedCatalogs.length > 0 ? (
                        approvedCatalogs.map((catalog: any) => (
                          <SelectItem key={catalog.id} value={catalog.id}>
                            {catalog.name} ({catalog.profiles?.company_name})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No approved catalogs</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCatalog && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Reseller Access</h3>
                    {loadingResellers ? (
                      <div className="text-center py-4">Loading resellers...</div>
                    ) : resellers && resellers.length > 0 ? (
                      <div className="space-y-4">
                        {resellers.map((reseller: any) => (
                          <div key={reseller.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                              <h4 className="font-medium">{reseller.company_name}</h4>
                              <p className="text-sm text-muted-foreground">{reseller.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor={`reseller-${reseller.id}`} className="mr-2">
                                Has Access
                              </Label>
                              <Switch 
                                id={`reseller-${reseller.id}`}
                                checked={selectedResellers.includes(reseller.id)}
                                onCheckedChange={(checked) => toggleResellerAccess(reseller.id, checked)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p>No resellers found.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CatalogApprovals;
