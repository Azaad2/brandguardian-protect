import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Star, StarOff, CheckCircle, XCircle, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Distributor {
  id: string;
  company_name: string;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  city: string | null;
  country_code: string | null;
  verification_status: string;
  featured: boolean;
  featured_priority: number;
  categories: string[] | null;
  created_at: string;
}

export const DistributorsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [distributorToDelete, setDistributorToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: distributors, isLoading } = useQuery({
    queryKey: ['distributors', searchQuery, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('distributors')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`company_name.ilike.%${searchQuery}%,contact_email.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
      }

      if (statusFilter !== 'all') {
        query = query.eq('verification_status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Distributor[];
    },
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, featured, priority }: { id: string; featured: boolean; priority: number }) => {
      const { error } = await supabase
        .from('distributors')
        .update({ featured, featured_priority: priority })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] });
      toast.success('Featured status updated');
    },
    onError: () => {
      toast.error('Failed to update featured status');
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('distributors')
        .update({ verification_status: status, verified_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] });
      toast.success('Verification status updated');
    },
    onError: () => {
      toast.error('Failed to update verification status');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('distributors')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributors'] });
      toast.success('Distributor deleted');
      setDeleteDialogOpen(false);
      setDistributorToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete distributor');
    },
  });

  const handleToggleFeatured = (distributor: Distributor) => {
    const newFeatured = !distributor.featured;
    const newPriority = newFeatured ? 1 : 0;
    toggleFeaturedMutation.mutate({ id: distributor.id, featured: newFeatured, priority: newPriority });
  };

  const handleVerify = (id: string, status: string) => {
    verifyMutation.mutate({ id, status });
  };

  const handleDeleteClick = (id: string) => {
    setDistributorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (distributorToDelete) {
      deleteMutation.mutate(distributorToDelete);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      verified: 'default',
      pending: 'secondary',
      rejected: 'destructive',
      unverified: 'outline',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>All Distributors</CardTitle>
          <CardDescription>
            Manage verification, featured status, and distributor information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company name, email, or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : !distributors || distributors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No distributors found</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {distributors.map((distributor) => (
                    <TableRow key={distributor.id}>
                      <TableCell>
                        <div className="font-medium">{distributor.company_name}</div>
                        {distributor.website_url && (
                          <a 
                            href={distributor.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Website
                          </a>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{distributor.contact_email}</div>
                        {distributor.contact_phone && (
                          <div className="text-xs text-muted-foreground">{distributor.contact_phone}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {distributor.city && distributor.country_code
                          ? `${distributor.city}, ${distributor.country_code}`
                          : distributor.city || distributor.country_code || '-'}
                      </TableCell>
                      <TableCell>
                        {distributor.categories && distributor.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {distributor.categories.slice(0, 2).map((cat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                            {distributor.categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{distributor.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(distributor.verification_status)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleFeatured(distributor)}
                        >
                          {distributor.featured ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {distributor.verification_status !== 'verified' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(distributor.id, 'verified')}
                              title="Verify"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {distributor.verification_status !== 'rejected' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerify(distributor.id, 'rejected')}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(distributor.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Distributor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this distributor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
