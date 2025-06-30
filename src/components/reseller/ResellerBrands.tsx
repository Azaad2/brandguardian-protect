
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Check, Clock, X, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAvailableBrands, useBrandApplications } from "@/hooks/use-brand-applications";

// Function to generate random letters for brand names
const generateRandomBrandName = (id: string) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const length = 6 + (hash % 4); // 6-9 characters
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }
  
  return result;
};

const ResellerBrands = () => {
  const { data: brands = [], isLoading, isError, error } = useAvailableBrands();
  const { applyToBrand, isApplying } = useBrandApplications();
  const [searchQuery, setSearchQuery] = useState("");

  // Transform brands to use random names
  const brandsWithRandomNames = brands.map(brand => ({
    ...brand,
    displayName: generateRandomBrandName(brand.id),
    displayDepartment: brand.department ? generateRandomBrandName(brand.id + '_dept') : undefined
  }));

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

  const filteredBrands = brandsWithRandomNames.filter(brand => 
    brand.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.displayDepartment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.categories?.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
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
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Available Brands</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Discover and apply to wholesale opportunities with top brands
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search brands, departments, or categories..." 
              className="pl-10 h-11"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="h-4 w-4" />
            <span className="font-medium">{filteredBrands.length} brands available</span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="h-80 animate-pulse">
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
          ) : filteredBrands.length === 0 ? (
            <div className="flex items-center justify-center h-96">
              <Card className="max-w-md text-center">
                <CardContent className="py-12">
                  <div className="text-gray-500 text-lg mb-2">
                    {searchQuery ? 'No brands match your search' : 'No brands available'}
                  </div>
                  <p className="text-gray-400">
                    {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new opportunities!'}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredBrands.map((brand) => (
                <Card key={brand.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4 flex-1">
                        {brand.logo_url && (
                          <div className="flex-shrink-0">
                            <img 
                              src={brand.logo_url} 
                              alt={`${brand.displayName} logo`}
                              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                            {brand.displayDepartment || brand.displayName}
                          </CardTitle>
                          {brand.displayDepartment && brand.displayDepartment !== brand.displayName && (
                            <p className="text-sm font-medium text-gray-500 mb-2">
                              by {brand.displayName}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-3 text-sm">
                            {brand.approval_rate && (
                              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                                <span className="text-green-700 font-semibold">{brand.approval_rate}%</span>
                                <span className="text-green-600 text-xs">approval</span>
                              </div>
                            )}
                            {brand.response_time && (
                              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                                <span className="text-blue-700 font-semibold">{brand.response_time}h</span>
                                <span className="text-blue-600 text-xs">response</span>
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
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {brand.description}
                      </p>
                    )}
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {brand.categories && brand.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {brand.categories.slice(0, 3).map((category) => (
                          <Badge key={category} variant="outline" className="text-xs font-medium px-2 py-1 bg-gray-50">
                            {category}
                          </Badge>
                        ))}
                        {brand.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs font-medium px-2 py-1 bg-gray-50">
                            +{brand.categories.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-2">
                      {brand.applicationStatus ? (
                        getStatusBadge(brand.applicationStatus)
                      ) : (
                        <Button 
                          onClick={() => handleApply(brand.id)}
                          disabled={isApplying}
                          className="w-full h-11 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
                          size="lg"
                        >
                          {isApplying ? 'Applying...' : 'Apply Now'}
                        </Button>
                      )}

                      {brand.applicationStatus === 'approved' && (
                        <Button variant="outline" className="w-full h-11 text-base font-semibold border-2 hover:bg-gray-50" size="lg">
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
    </div>
  );
};

export default ResellerBrands;
