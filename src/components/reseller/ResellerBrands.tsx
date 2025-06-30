
import { useState } from "react";
import { useAvailableBrands, useBrandApplications } from "@/hooks/use-brand-applications";
import { transformBrandsWithRandomNames } from "./brands/utils/brandNameUtils";
import BrandsHeader from "./brands/components/BrandsHeader";
import BrandsSearchBar from "./brands/components/BrandsSearchBar";
import BrandCard from "./brands/components/BrandCard";
import BrandsLoadingState from "./brands/components/BrandsLoadingState";
import BrandsErrorState from "./brands/components/BrandsErrorState";
import BrandsEmptyState from "./brands/components/BrandsEmptyState";

const ResellerBrands = () => {
  const { data: brands = [], isLoading, isError, error } = useAvailableBrands();
  const { applyToBrand, isApplying } = useBrandApplications();
  const [searchQuery, setSearchQuery] = useState("");

  // Transform brands to use random names
  const brandsWithRandomNames = transformBrandsWithRandomNames(brands);

  const handleApply = async (brandId: string) => {
    await applyToBrand({ brandId });
  };

  const filteredBrands = brandsWithRandomNames.filter(brand => 
    brand.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.displayDepartment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.categories?.some((cat: string) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isError) {
    return <BrandsErrorState error={error} />;
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <BrandsHeader />
      <BrandsSearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredBrandsCount={filteredBrands.length}
      />

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <BrandsLoadingState />
          ) : filteredBrands.length === 0 ? (
            <BrandsEmptyState searchQuery={searchQuery} />
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {filteredBrands.map((brand) => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  onApply={handleApply}
                  isApplying={isApplying}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResellerBrands;
