
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Clock, X } from "lucide-react";
import { useAvailableBrands, useBrandApplications } from "@/hooks/use-brand-applications";

const ResellerBrands = () => {
  const { data: brands = [], isLoading, isError, error } = useAvailableBrands();
  const { applyToBrand, isApplying } = useBrandApplications();

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">✓ Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600">⏳ Applied</Badge>;
      case 'rejected':
        return <Badge variant="destructive">✗ Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleApply = async (brandId: string) => {
    await applyToBrand({ brandId });
  };

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Available Brands</h1>
          <p className="text-muted-foreground">Discover and apply to wholesale opportunities</p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load available brands'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Brands</h1>
        <p className="text-muted-foreground">Discover and apply to wholesale opportunities with one click</p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brands.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              No brands are currently available for applications. Check back later!
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <Card key={brand.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {brand.logo_url && (
                      <img 
                        src={brand.logo_url} 
                        alt={`${brand.name || 'Brand'} logo`}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {brand.department || brand.name || 'Unknown Brand'}
                      </CardTitle>
                      {brand.department && brand.name && (
                        <div className="text-sm text-muted-foreground">
                          Brand: {brand.name}
                        </div>
                      )}
                      {!brand.department && brand.name && (
                        <div className="text-sm text-muted-foreground">
                          Brand Name
                        </div>
                      )}
                      {brand.approval_rate && (
                        <div className="text-sm text-muted-foreground">
                          Approval Rate: {brand.approval_rate}%
                        </div>
                      )}
                      {brand.response_time && (
                        <div className="text-sm text-muted-foreground">
                          Response Time: {brand.response_time}h
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusIcon(brand.applicationStatus)}
                </div>
                {brand.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {brand.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {brand.categories && brand.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {brand.categories.slice(0, 3).map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {brand.categories.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{brand.categories.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {brand.applicationStatus ? (
                    getStatusBadge(brand.applicationStatus)
                  ) : (
                    <Button 
                      onClick={() => handleApply(brand.id)}
                      disabled={isApplying}
                      className="w-full"
                    >
                      {isApplying ? 'Applying...' : 'Apply Now'}
                    </Button>
                  )}
                </div>

                {brand.applicationStatus === 'approved' && (
                  <Button variant="outline" className="w-full">
                    View Catalog
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResellerBrands;
