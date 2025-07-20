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
    if (selectedBrands.size === 0) {
      toast.error('No brands selected for deletion');
      return;
    }

    console.log('=== DELETION PROCESS STARTING ===');
    console.log('Selected brands for deletion:', Array.from(selectedBrands));
    console.log('Delete mutation available:', !!deleteBrandMutation);
    console.log('Delete mutation status:', deleteBrandMutation?.status);

    // Check if mutation function exists
    if (!deleteBrandMutation || !deleteBrandMutation.mutateAsync) {
      console.error('❌ Delete mutation is not available!');
      toast.error('Delete function is not available. Please refresh the page.');
      return;
    }

    try {
      const results = [];
      let successCount = 0;
      let failCount = 0;

      for (const brandId of selectedBrands) {
        console.log(`🗑️ Attempting to delete brand: ${brandId}`);
        
        try {
          // Call the mutation
          console.log(`Calling deleteBrandMutation.mutateAsync(${brandId})`);
          const deleteResult = await deleteBrandMutation.mutateAsync(brandId);
          console.log(`✅ Delete mutation completed for brand ${brandId}:`, deleteResult);
          
          successCount++;
          results.push({ brandId, success: true, result: deleteResult });
        } catch (error) {
          console.error(`❌ Failed to delete brand ${brandId}:`, error);
          console.error(`Error details:`, {
            name: error?.name,
            message: error?.message,
            stack: error?.stack
          });
          
          failCount++;
          results.push({ brandId, success: false, error });
        }
      }
      
      console.log('=== DELETION PROCESS COMPLETED ===');
      console.log(`Total processed: ${selectedBrands.size}`);
      console.log(`Successful deletions: ${successCount}`);
      console.log(`Failed deletions: ${failCount}`);
      console.log('Detailed results:', results);
      
      // Show appropriate toast messages
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} duplicate brand${successCount > 1 ? 's' : ''}`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} brand${failCount > 1 ? 's' : ''}. Check console for details.`);
      }
      
      // Reset state
      setSelectedBrands(new Set());
      setShowConfirmDialog(false);
      
      // Close dialog and refresh if any deletions were successful
      if (successCount > 0) {
        setOpen(false);
        // Force immediate refresh
        window.location.reload();
      }
      
    } catch (error) {
      console.error('=== UNEXPECTED ERROR IN DELETION HANDLER ===', error);
      toast.error('An unexpected error occurred during deletion. Please try again.');
    }
  };

  const handleDeleteAllDuplicates = async () => {
    const allDuplicates = new Set<string>();
    duplicates.forEach(group => {
      // Add all brands except the first one (the one to keep)
      group.brands.slice(1).forEach(brand => {
        allDuplicates.add(brand.id);
      });
    });

    if (allDuplicates.size === 0) {
      toast.error('No duplicates found to delete');
      return;
    }

    console.log('=== BULK DELETE ALL DUPLICATES ===');
    console.log(`Total duplicates to delete: ${allDuplicates.size}`);

    try {
      let successCount = 0;
      let failCount = 0;

      for (const brandId of allDuplicates) {
        try {
          await deleteBrandMutation.mutateAsync(brandId);
          successCount++;
        } catch (error) {
          console.error(`Failed to delete brand ${brandId}:`, error);
          failCount++;
        }
      }
      
      console.log(`Deletion completed: ${successCount} success, ${failCount} failed`);
      
      if (successCount > 0) {
        toast.success(`Successfully deleted ${successCount} duplicate brands`);
      }
      if (failCount > 0) {
        toast.error(`Failed to delete ${failCount} brands`);
      }

      setOpen(false);
      window.location.reload();
      
    } catch (error) {
      console.error('Error in bulk deletion:', error);
      toast.error('An error occurred during bulk deletion');
    }
  };

  if (duplicates.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Review Duplicates ({duplicates.reduce((acc, group) => acc + group.brands.length - 1, 0)})
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
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600">
                {duplicates.reduce((acc, group) => acc + group.brands.length - 1, 0)} total duplicates found
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  const newSelected = new Set<string>();
                  duplicates.forEach(group => {
                    // Select all brands except the first one (the one to keep)
                    group.brands.slice(1).forEach(brand => {
                      newSelected.add(brand.id);
                    });
                  });
                  setSelectedBrands(newSelected);
                }}
                className="gap-2"
              >
                Select All Duplicates
              </Button>
            </div>
            
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

        <Button 
          variant="destructive" 
          className="gap-2"
          onClick={handleDeleteAllDuplicates}
        >
          <Trash2 className="h-4 w-4" />
          Delete All Duplicates ({duplicates.reduce((acc, group) => acc + group.brands.length - 1, 0)})
        </Button>
      </div>

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
