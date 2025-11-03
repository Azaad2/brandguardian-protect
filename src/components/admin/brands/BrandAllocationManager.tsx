
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Users, Trash2 } from 'lucide-react';
import { Brand } from './types';

interface BrandAllocationManagerProps {
  brand: Brand;
}

interface ResellerProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  email: string;
}

interface BrandAllocation {
  reseller_id: string;
  allocated_at: string;
  profiles: ResellerProfile;
}

const BrandAllocationManager = ({ brand }: BrandAllocationManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch resellers
  const { data: resellers = [] } = useQuery({
    queryKey: ['resellers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, email')
        .eq('user_role', 'reseller');
      
      if (error) throw error;
      return data as ResellerProfile[];
    },
  });

  // Fetch current allocations for this brand
  const { data: allocations = [], isLoading } = useQuery({
    queryKey: ['brand-allocations', brand.id],
    queryFn: async () => {
      // First get the allocations
      const { data: allocationData, error: allocationError } = await supabase
        .from('brand_reseller_allocations')
        .select('reseller_id, allocated_at')
        .eq('brand_id', brand.id);
      
      if (allocationError) throw allocationError;
      
      if (!allocationData || allocationData.length === 0) {
        return [];
      }

      // Then get the profiles for those resellers
      const resellerIds = allocationData.map(allocation => allocation.reseller_id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, email')
        .in('id', resellerIds);
      
      if (profileError) throw profileError;

      // Combine the data
      return allocationData.map(allocation => ({
        reseller_id: allocation.reseller_id,
        allocated_at: allocation.allocated_at,
        profiles: profileData?.find(profile => profile.id === allocation.reseller_id) || {
          id: allocation.reseller_id,
          full_name: null,
          company_name: null,
          email: 'Unknown'
        }
      })) as BrandAllocation[];
    },
    enabled: isOpen,
  });

  // Allocate brand to reseller
  const allocateMutation = useMutation({
    mutationFn: async (resellerId: string) => {
      const { data, error } = await supabase.rpc('admin_allocate_brand_to_reseller', {
        p_brand_id: brand.id,
        p_reseller_id: resellerId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-allocations', brand.id] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-brands'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-brands-count'] });
      setSelectedReseller('');
      toast({
        title: 'Brand Allocated',
        description: 'Brand has been allocated to the reseller.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to allocate brand: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Remove allocation
  const removeAllocationMutation = useMutation({
    mutationFn: async (resellerId: string) => {
      const { data, error } = await supabase.rpc('admin_remove_brand_allocation', {
        p_brand_id: brand.id,
        p_reseller_id: resellerId
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand-allocations', brand.id] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-brands'] });
      queryClient.invalidateQueries({ queryKey: ['optimized-brands-count'] });
      toast({
        title: 'Allocation Removed',
        description: 'Brand allocation has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to remove allocation: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const availableResellers = resellers.filter(
    reseller => !allocations.some(allocation => allocation.reseller_id === reseller.id)
  );

  const handleAllocate = () => {
    if (selectedReseller) {
      allocateMutation.mutate(selectedReseller);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="h-4 w-4 mr-2" />
          Manage Access ({allocations.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Brand Access - {brand.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add new allocation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allocate to Reseller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedReseller} onValueChange={setSelectedReseller}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a reseller..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableResellers.map((reseller) => (
                      <SelectItem key={reseller.id} value={reseller.id}>
                        {reseller.company_name || reseller.full_name || reseller.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleAllocate}
                  disabled={!selectedReseller || allocateMutation.isPending}
                >
                  {allocateMutation.isPending ? 'Allocating...' : 'Allocate'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current allocations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Allocations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Loading allocations...</div>
              ) : allocations.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No resellers have access to this brand yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {allocations.map((allocation) => (
                    <div key={allocation.reseller_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {allocation.profiles.company_name || allocation.profiles.full_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {allocation.profiles.email}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Allocated: {new Date(allocation.allocated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAllocationMutation.mutate(allocation.reseller_id)}
                        disabled={removeAllocationMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrandAllocationManager;
