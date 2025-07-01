
import { useState } from "react";
import { useAvailableBrands, useBrandApplications } from "@/hooks/use-brand-applications";
import { useSubscription } from "@/hooks/use-subscription";
import { transformBrandsWithRandomNames } from "./brands/utils/brandNameUtils";
import BrandsHeader from "./brands/components/BrandsHeader";
import BrandsSearchBar from "./brands/components/BrandsSearchBar";
import BrandCard from "./brands/components/BrandCard";
import BrandsLoadingState from "./brands/components/BrandsLoadingState";
import BrandsErrorState from "./brands/components/BrandsErrorState";
import BrandsEmptyState from "./brands/components/BrandsEmptyState";
import UsageIndicator from "./subscription/UsageIndicator";
import SubscriptionUpgrade from "./subscription/SubscriptionUpgrade";

const ResellerBrands = () => {
  const { data: brands = [], isLoading, isError, error } = useAvailableBrands();
  const { 
    applyToBrand, 
    isApplying, 
    canApplyToMoreBrands, 
    applicationCount, 
    applicationLimit,
    subscriptionTier 
  } = useBrandApplications();
  const { subscription, updateSubscription, isUpdating } = useSubscription();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Transform brands to use random names
  const brandsWithRandomNames = transformBrandsWithRandomNames(brands);

  const handleApply = async (brandId: string) => {
    if (!canApplyToMoreBrands) {
      setShowUpgrade(true);
      return;
    }
    await applyToBrand({ brandId });
  };

  const handleUpgrade = (tier: string) => {
    // In a real implementation, this would redirect to Stripe checkout
    console.log('Upgrading to:', tier);
    // For now, just show a message
    alert(`Upgrade to ${tier} plan - Stripe integration would go here`);
  };

  const filteredBrands = brandsWithRandomNames.filter(brand => 
    brand.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.displayDepartment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.categories?.some((cat: string) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isError) {
    return <BrandsErrorState error={error} />;
  }

  if (showUpgrade) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
        <BrandsHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <SubscriptionUpgrade
            currentApplications={applicationCount}
            currentLimit={applicationLimit}
            onUpgrade={handleUpgrade}
            isUpgrading={isUpdating}
          />
          <div className="text-center mt-6">
            <button
              onClick={() => setShowUpgrade(false)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to Brands
            </button>
          </div>
        </div>
      </div>
    );
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
          {/* Usage Indicator */}
          <UsageIndicator
            currentApplications={applicationCount}
            limit={applicationLimit}
            subscriptionTier={subscriptionTier}
          />

          {/* Upgrade prompt if at limit */}
          {!canApplyToMoreBrands && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-amber-800">Application Limit Reached</h3>
                  <p className="text-amber-700 text-sm">
                    You've reached your limit of {applicationLimit} brand applications. Upgrade to apply to more brands.
                  </p>
                </div>
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 font-medium"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

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
                  canApply={canApplyToMoreBrands}
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
