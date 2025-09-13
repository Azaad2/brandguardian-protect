
import { useSubscription } from '@/hooks/use-subscription';
import { useBrandApplications, useAvailableBrands } from '@/hooks/use-brand-applications';
import { useBrandFilters } from '@/hooks/use-brand-filters';
import UsageIndicator from '@/components/reseller/subscription/UsageIndicator';
import SubscriptionUpgrade from '@/components/reseller/subscription/SubscriptionUpgrade';
import SubscriptionManager from '@/components/reseller/subscription/SubscriptionManager';
import BrandsHeader from './components/BrandsHeader';
import BrandsFilter from './components/BrandsFilter';
import BrandCard from './components/BrandCard';
import BrandsLoadingState from './components/BrandsLoadingState';
import BrandsErrorState from './components/BrandsErrorState';
import BrandsEmptyState from './components/BrandsEmptyState';
import QuickFilterButtons from './components/QuickFilterButtons';

const ResellerBrandsContainer = () => {
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { applications, applyToBrand, isApplying } = useBrandApplications();
  const { data: availableBrands, isLoading, error } = useAvailableBrands();
  
  // Use the new filtering hook
  const { filters, setFilters, filteredBrands, filterSuggestions } = useBrandFilters(availableBrands);

  const currentApplications = applications?.length || 0;
  const limit = 999999; // Unlimited applications
  const isAtLimit = false; // Never at limit

  if (subscriptionLoading || isLoading) {
    return <BrandsLoadingState />;
  }

  if (error) {
    return <BrandsErrorState error={error} />;
  }

  // Show upgrade component for premium features, not application limits
  const showUpgrade = !subscription?.subscribed && subscription?.subscription_tier === 'free';

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BrandsHeader />
      
      {/* Subscription Management */}
      {subscription?.subscribed && <SubscriptionManager />}
      
      {/* Upgrade Component for Premium Features */}
      {showUpgrade && (
        <div className="mb-6">
          <SubscriptionUpgrade 
            currentApplications={currentApplications}
            currentLimit={limit}
          />
        </div>
      )}
      
      <QuickFilterButtons 
        filters={filters}
        onFiltersChange={setFilters}
        suggestions={filterSuggestions}
      />
      
      <BrandsFilter 
        filters={filters}
        onFiltersChange={setFilters}
        filteredBrandsCount={filteredBrands.length}
        totalBrandsCount={availableBrands?.length || 0}
      />
      
      {filteredBrands.length === 0 ? (
        <BrandsEmptyState searchQuery={filters.searchQuery} filters={filters} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <BrandCard 
              key={brand.id} 
              brand={brand}
              onApply={(brandId) => applyToBrand({ brandId })}
              isApplying={isApplying}
              canApply={true} // Always allow applications
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResellerBrandsContainer;
