import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Copy, Trash2 } from 'lucide-react';
import { Brand } from './types';
import { useBrands } from './useBrands';
import { toast } from 'sonner';

interface DuplicateGroup {
  key: string;
  brands: Brand[];
}

interface DuplicateBrandRemoverProps {
  brands: Brand[];
}

const DuplicateBrandRemover = ({ brands }: DuplicateBrandRemoverProps) => {
  const [open, setOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { deleteBrandMutation } = useBrands();

  // Find duplicates based on name and contact_email
  const findDuplicates = (): DuplicateGroup[] => {
    const groupMap = new Map<string, Brand[]>();
    
    brands.forEach(brand => {
      const key = `${brand.name.toLowerCase().trim()}-${brand.contact_email.toLowerCase().trim()}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, []);
      }
      groupMap.get(key)!.push(brand);
    });

    // Only return groups with more than one brand (duplicates)
    return Array.from(groupMap.entries())
      .filter(([_, brands]) => brands.length > 1)
      .map(([key, brands]) => ({ key, brands }));
  };

  const duplicates = findDuplicates();

  const handleSelectBrand = (brandId: string, checked: boolean) => {
    const newSelected = new Set(selectedBrands);
    if (checked) {
      newSelected.add(brandId);
    } else {
      newSelected.delete(brandId);
    }
    setSelectedBrands(newSelected);
  };

  const handleSelectAll = (group: DuplicateGroup, checked: boolean) => {
    const newSelected = new Set(selectedBrands);
    // Keep the first brand (oldest) and select the rest for deletion
    const toSelect = group.brands.slice(1);
    
    toSelect.forEach(brand => {
      if (checked) {
        newSelected.add(brand.id);
      } else {
        newSelected.delete(brand.id);
      }
    });
    setSelectedBrands(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      console.log('Starting bulk deletion of brands:', Array.from(selectedBrands));
      
      // Delete brands one by one to see individual results
      const results = [];
      for (const brandId of selectedBrands) {
        try {
          console.log('Deleting brand:', brandId);
          const result = await deleteBrandMutation.mutateAsync(brandId);
          results.push({ brandId, success: true, result });
          console.log('Successfully deleted brand:', brandId, result);
        } catch (error) {
          console.error('Failed to delete brand:', brandId, error);
          results.push({ brandId, success: false, error });
        }
      }
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} duplicate brands`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} brands. Check console for details.`);
      }
      
      setSelectedBrands(new Set());
      setShowConfirmDialog(false);
      setOpen(false);
      
      // Force refresh of the page data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting brands:', error);
      toast.error('Failed to delete some brands. Please try again.');
    }
  };

  if (duplicates.length === 0) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Copy className="h-4 w-4" />
            Remove Duplicates ({duplicates.reduce((acc, group) => acc + group.brands.length - 1, 0)})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Remove Duplicate Brands</DialogTitle>
            <DialogDescription>
              Found {duplicates.length} groups of duplicate brands. Select the duplicates you want to remove. 
              The first brand in each group (usually the oldest) is recommended to keep.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {duplicates.map((group, index) => (
              <div key={group.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">
                    Duplicate Group {index + 1}: {group.brands[0].name}
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(group, !group.brands.slice(1).every(b => selectedBrands.has(b.id)))}
                  >
                    {group.brands.slice(1).every(b => selectedBrands.has(b.id)) ? 'Deselect All' : 'Select All Duplicates'}
                  </Button>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Select</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.brands.map((brand, brandIndex) => (
                      <TableRow key={brand.id} className={brandIndex === 0 ? 'bg-green-50' : ''}>
                        <TableCell>
                          {brandIndex === 0 ? (
                            <Badge variant="secondary" className="text-xs">Keep</Badge>
                          ) : (
                            <Checkbox
                              checked={selectedBrands.has(brand.id)}
                              onCheckedChange={(checked) => handleSelectBrand(brand.id, checked as boolean)}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {brand.logo_url && (
                              <img 
                                src={brand.logo_url} 
                                alt={`${brand.name} logo`}
                                className="w-8 h-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium">{brand.name}</div>
                              {brand.description && (
                                <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">
                                  {brand.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{brand.contact_email}</TableCell>
                        <TableCell>
                          {brand.department ? (
                            <Badge variant="outline">{brand.department}</Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>{new Date(brand.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={brand.is_active ? "default" : "secondary"}>
                            {brand.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-gray-600">
              {selectedBrands.size} brands selected for deletion
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowConfirmDialog(true)}
                disabled={selectedBrands.size === 0}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedBrands.size})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedBrands.size} duplicate brands? 
              This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete {selectedBrands.size} Brands
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DuplicateBrandRemover;
