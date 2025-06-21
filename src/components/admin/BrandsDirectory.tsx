
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Upload } from 'lucide-react';
import { useBrands } from './brands/useBrands';
import { Brand, BrandFormData } from './brands/types';
import BrandForm from './brands/BrandForm';
import BrandsTable from './brands/BrandsTable';
import BrandCSVUpload from './brands/BrandCSVUpload';

const BrandsDirectory = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkUploadDialogOpen, setIsBulkUploadDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const {
    brands,
    isLoading,
    addBrandMutation,
    updateBrandMutation,
    toggleStatusMutation,
  } = useBrands();

  const resetForm = () => {
    setEditingBrand(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsAddDialogOpen(true);
  };

  const handleSubmit = (formData: BrandFormData) => {
    const categoriesArray = formData.categories
      ? formData.categories.split(',').map(c => c.trim()).filter(c => c.length > 0)
      : [];
    
    if (editingBrand) {
      updateBrandMutation.mutate({
        id: editingBrand.id,
        name: formData.name,
        website_url: formData.website_url,
        description: formData.description,
        contact_email: formData.contact_email,
        logo_url: formData.logo_url,
        categories: categoriesArray,
      });
    } else {
      addBrandMutation.mutate({
        name: formData.name,
        website_url: formData.website_url,
        description: formData.description,
        contact_email: formData.contact_email,
        logo_url: formData.logo_url,
        categories: categoriesArray,
        is_active: true,
      });
    }
  };

  const toggleBrandStatus = (brand: Brand) => {
    toggleStatusMutation.mutate({
      id: brand.id,
      is_active: !brand.is_active,
    });
  };

  const handleBulkUploadSuccess = () => {
    setIsBulkUploadDialogOpen(false);
    // Brands will be refetched automatically due to query invalidation
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Brands Directory</h1>
          <p className="text-muted-foreground">Manage brands available for reseller applications</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isBulkUploadDialogOpen} onOpenChange={setIsBulkUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Bulk Upload Brands</DialogTitle>
              </DialogHeader>
              <BrandCSVUpload onSuccess={handleBulkUploadSuccess} />
            </DialogContent>
          </Dialog>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
              </DialogHeader>
              <BrandForm
                editingBrand={editingBrand}
                onSubmit={handleSubmit}
                onCancel={resetForm}
                isLoading={addBrandMutation.isPending || updateBrandMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Brands</CardTitle>
          <CardDescription>
            {brands.length} brands in directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading brands...</div>
          ) : (
            <BrandsTable
              brands={brands}
              onEdit={handleEdit}
              onToggleStatus={toggleBrandStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandsDirectory;
