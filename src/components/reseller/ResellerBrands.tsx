
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
        return <Badge className="bg-green-600 text-white font-medium">✓ Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600 text-white font-medium">⏳ Applied</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="font-medium">✗ Rejected</Badge>;
      default:
        return null;
    }
  };

  const handleApply = async (brandId: string) => {
    await applyToBrand({ brandId });
  };

  if (isError) {
    return (
      <div className="space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Available Brands</h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">Discover and apply to wholesale opportunities</p>
        </div>
        
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle className="text-lg font-semibold">Error</AlertTitle>
          <AlertDescription className="text-base">
            {error instanceof Error ? error.message : 'Failed to load available brands'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Available Brands
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover and apply to wholesale opportunities with one click
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="h-80">
                <CardHeader className="pb-4">
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : brands.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-16">
              <div className="text-gray-500 text-lg">
                No brands are currently available for applications. Check back later!
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {brands.map((brand) => (
              <Card key={brand.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-4 flex-1">
                      {brand.logo_url && (
                        <div className="flex-shrink-0">
                          <img 
                            src={brand.logo_url} 
                            alt={`${brand.name} logo`}
                            className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 line-clamp-2">
                          {brand.department || brand.name}
                        </CardTitle>
                        {brand.department && brand.name !== brand.department && (
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            {brand.name}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-3 text-sm">
                          {brand.approval_rate && (
                            <div className="text-gray-600 font-medium">
                              <span className="text-green-600 font-semibold">{brand.approval_rate}%</span> approval
                            </div>
                          )}
                          {brand.response_time && (
                            <div className="text-gray-600 font-medium">
                              <span className="text-blue-600 font-semibold">{brand.response_time}h</span> response
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusIcon(brand.applicationStatus)}
                    </div>
                  </div>
                  {brand.description && (
                    <p className="text-base text-gray-600 line-clamp-3 leading-relaxed">
                      {brand.description}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {brand.categories && brand.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {brand.categories.slice(0, 3).map((category) => (
                        <Badge key={category} variant="outline" className="text-sm font-medium px-3 py-1">
                          {category}
                        </Badge>
                      ))}
                      {brand.categories.length > 3 && (
                        <Badge variant="outline" className="text-sm font-medium px-3 py-1">
                          +{brand.categories.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3">
                    {brand.applicationStatus ? (
                      getStatusBadge(brand.applicationStatus)
                    ) : (
                      <Button 
                        onClick={() => handleApply(brand.id)}
                        disabled={isApplying}
                        className="w-full h-12 text-base font-semibold"
                        size="lg"
                      >
                        {isApplying ? 'Applying...' : 'Apply Now'}
                      </Button>
                    )}

                    {brand.applicationStatus === 'approved' && (
                      <Button variant="outline" className="w-full h-12 text-base font-semibold" size="lg">
                        View Catalog
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResellerBrands;
