import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Package, DollarSign, TrendingUp } from "lucide-react";
import { useBrandProducts } from "@/hooks/use-brand-data";
import InventoryHeader from "./inventory/InventoryHeader";
import InventoryActionButtons from "./inventory/InventoryActionButtons";
import CatalogUploadForm from "./inventory/CatalogUploadForm";
import CatalogList from "./inventory/CatalogList";
import { useCatalogUpload } from "./inventory/hooks/useCatalogUpload";
import { useCatalogs } from "./inventory/hooks/useCatalogs";

const BrandInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: products = [], isLoading, error } = useBrandProducts();
  
  const { 
    file, 
    catalogName, 
    uploading, 
    setCatalogName, 
    handleFileChange, 
    resetForm,
    uploadCatalog 
  } = useCatalogUpload();
  
  const { data: catalogs, isLoading: catalogsLoading } = useCatalogs();

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <InventoryHeader />
        <Card>
          <CardContent className="flex h-40 items-center justify-center">
            <div className="text-center">
              <h3 className="mb-1 text-lg font-medium text-red-600">Error loading inventory</h3>
              <p className="text-muted-foreground">Please try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <InventoryHeader />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">In your catalog</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.filter(p => p.approval_status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0 
                ? formatPrice(products.reduce((sum, p) => sum + Number(p.price || 0), 0) / products.length)
                : '$0.00'
              }
            </div>
            <p className="text-xs text-muted-foreground">Across all products</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <InventoryActionButtons onFileSelect={handleFileChange} />
      </div>
      
      {/* Catalog Upload Form */}
      {file && (
        <CatalogUploadForm
          file={file}
          catalogName={catalogName}
          setCatalogName={setCatalogName}
          uploading={uploading}
          onCancel={resetForm}
          onSubmit={() => uploadCatalog.mutate()}
        />
      )}

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed">
              <div className="text-center">
                <h3 className="mb-1 text-lg font-medium">
                  {products.length === 0 ? 'No products in inventory' : 'No products found'}
                </h3>
                <p className="text-muted-foreground">
                  {products.length === 0 
                    ? 'Upload a catalog to add products to your inventory.'
                    : 'Try adjusting your search terms.'
                  }
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                    <TableCell>{formatPrice(Number(product.price))}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(product.approval_status || 'pending')}>
                        {(product.approval_status || 'pending').charAt(0).toUpperCase() + 
                         (product.approval_status || 'pending').slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* Uploaded Catalogs List */}
      <CatalogList 
        catalogs={catalogs} 
        isLoading={catalogsLoading} 
        onFileSelect={handleFileChange} 
      />
    </div>
  );
};

export default BrandInventory;