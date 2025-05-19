
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useResellerBrands } from "@/hooks/use-reseller-brands";

const ResellerBrands = () => {
  const { brands, isLoading, isError, error } = useResellerBrands();

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Brand Partnerships</h1>
          <p className="text-muted-foreground">Browse and manage your brand partnerships</p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load brand partnerships'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Brand Partnerships</h1>
        <p className="text-muted-foreground">Browse and manage your brand partnerships</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Brands</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Min. Order</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <TableRow key={brand.name}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>{brand.category}</TableCell>
                      <TableCell>{brand.productsCount}</TableCell>
                      <TableCell>{brand.minOrder}</TableCell>
                      <TableCell>{brand.lastOrder}</TableCell>
                      <TableCell>
                        <Badge variant={brand.status === 'Approved' ? 'default' : 'secondary'}>
                          {brand.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        No brand partnerships found. Apply to brands to establish partnerships.
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerBrands;
