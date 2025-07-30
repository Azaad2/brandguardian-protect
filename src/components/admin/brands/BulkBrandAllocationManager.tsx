
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';
import { Brand } from './types';

interface ResellerProfile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  email: string;
}

const BulkBrandAllocationManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReseller, setSelectedReseller] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
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

  // Fetch brands
  const { data: brands = [] } = useQuery({
    queryKey: ['brands-directory'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('admin_get_brands' as any);
      
      if (error) {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('brands_directory')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (fallbackError) {
          throw fallbackError;
        }
        return fallbackData as Brand[];
      }
      
      return data as Brand[];
    },
  });

  // Fetch current allocations for selected reseller
  const { data: allocations = [] } = useQuery({
    queryKey: ['reseller-allocations', selectedReseller],
    queryFn: async () => {
      if (!selectedReseller) return [];
      
      const { data, error } = await supabase
        .from('brand_reseller_allocations')
        .select('brand_id')
        .eq('reseller_id', selectedReseller);
      
      if (error) throw error;
      return data.map(allocation => allocation.brand_id);
    },
    enabled: !!selectedReseller,
  });

  // Bulk allocate brands mutation
  const bulkAllocateMutation = useMutation({
    mutationFn: async (brandIds: string[]) => {
      const results = await Promise.allSettled(
        brandIds.map(brandId =>
          supabase.rpc('admin_allocate_brand_to_reseller', {
            p_brand_id: brandId,
            p_reseller_id: selectedReseller
          })
        )
      );
      
      const errors = results
        .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
        .map(result => result.reason);
      
      if (errors.length > 0) {
        throw new Error(`Some allocations failed: ${errors.map(e => e.message).join(', ')}`);
      }
      
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reseller-allocations', selectedReseller] });
      queryClient.invalidateQueries({ queryKey: ['available-brands'] });
      setSelectedBrands([]);
      toast({
        title: 'Brands Allocated',
        description: `Successfully allocated ${selectedBrands.length} brands to the reseller.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to allocate brands: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const availableBrands = brands.filter(brand => !allocations.includes(brand.id));

  const handleBrandSelection = (brandId: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands(prev => [...prev, brandId]);
    } else {
      setSelectedBrands(prev => prev.filter(id => id !== brandId));
    }
  };

  const handleSelectAll = () => {
    if (selectedBrands.length === availableBrands.length) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands(availableBrands.map(brand => brand.id));
    }
  };

  const handleBulkAllocate = () => {
    if (selectedBrands.length > 0 && selectedReseller) {
      bulkAllocateMutation.mutate(selectedBrands);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="h-4 w-4 mr-2" />
          Bulk Allocate Brands
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Allocate Brands to Reseller</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Reseller Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Reseller</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedReseller} onValueChange={setSelectedReseller}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reseller..." />
                </SelectTrigger>
                <SelectContent>
                  {resellers.map((reseller) => (
                    <SelectItem key={reseller.id} value={reseller.id}>
                      {reseller.company_name || reseller.full_name || reseller.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Brand Selection */}
          {selectedReseller && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Available Brands ({availableBrands.length})
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                    >
                      {selectedBrands.length === availableBrands.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <Button
                      onClick={handleBulkAllocate}
                      disabled={selectedBrands.length === 0 || bulkAllocateMutation.isPending}
                      size="sm"
                    >
                      {bulkAllocateMutation.isPending 
                        ? `Allocating ${selectedBrands.length} brands...` 
                        : `Allocate ${selectedBrands.length} selected`
                      }
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {availableBrands.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    All brands are already allocated to this reseller.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={brand.id}
                          checked={selectedBrands.includes(brand.id)}
                          onCheckedChange={(checked) => handleBrandSelection(brand.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={brand.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {brand.name}
                          </label>
                          {brand.description && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {brand.description.substring(0, 100)}
                              {brand.description.length > 100 ? '...' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkBrandAllocationManager;
