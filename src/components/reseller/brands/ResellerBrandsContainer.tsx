
import { useSubscription } from '@/hooks/use-subscription';
import { useBrandApplications } from '@/hooks/use-brand-applications';
import { useOptimizedBrands } from '@/hooks/use-optimized-brands';
import { useBrandFilters } from '@/hooks/use-brand-filters';
import { usePerformanceMonitoring } from '@/hooks/use-performance';
import SubscriptionUpgrade from '@/components/reseller/subscription/SubscriptionUpgrade';
import SubscriptionManager from '@/components/reseller/subscription/SubscriptionManager';
import BrandsHeader from './components/BrandsHeader';
import BrandsFilter from './components/BrandsFilter';
import BrandsLoadingState from './components/BrandsLoadingState';
import BrandsErrorState from './components/BrandsErrorState';
import BrandsEmptyState from './components/BrandsEmptyState';
import QuickFilterButtons from './components/QuickFilterButtons';
import VirtualBrandList from './components/VirtualBrandList';
import PerformanceSkeleton from './components/PerformanceSkeleton';
import { MemoizedBrandCard } from './components/MemoizedBrandCard';
import React, { useState, useMemo, useCallback, Suspense } from 'react';

const ResellerBrandsContainer = () => {
  // Enable performance monitoring
  usePerformanceMonitoring();
  
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { applyToBrand, isApplying } = useBrandApplications();
  
  // Local filter state for optimized performance
  const [filters, setFilters] = useState({
    searchQuery: '',
    applicationStatus: [],
    followUpActions: [],
    timeFilters: []
  });
  
  // Use optimized brands hook with server-side filtering
  const { 
    brands: optimizedBrands, 
    isLoading, 
    error,
    totalCount,
    prefetchNextPage
  } = useOptimizedBrands(filters, 50, 0);
  
  // Use client-side filtering hook for additional filtering logic
  const { filteredBrands, filterSuggestions } = useBrandFilters(optimizedBrands);
  
  // Use virtual scrolling for large lists
  const shouldUseVirtualScrolling = useMemo(() => filteredBrands.length > 20, [filteredBrands.length]);
  
  const handleApply = useCallback((brandId: string) => {
    applyToBrand({ brandId });
  }, [applyToBrand]);

  if (subscriptionLoading || isLoading) {
    return <BrandsLoadingState />;
  }

  if (error) {
    return <BrandsErrorState error={error} />;
  }

  // Show upgrade component for premium features, not application limits
  const showUpgrade = !subscription?.subscribed && subscription?.subscription_tier === 'free';
  const currentApplications = 0; // We're not tracking this anymore
  const limit = 999999; // Unlimited

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
      
      <Suspense fallback={<PerformanceSkeleton />}>
        <QuickFilterButtons 
          filters={filters}
          onFiltersChange={setFilters}
          suggestions={filterSuggestions}
        />
        
        <BrandsFilter 
          filters={filters}
          onFiltersChange={setFilters}
          filteredBrandsCount={filteredBrands.length}
          totalBrandsCount={totalCount}
        />
        
        {filteredBrands.length === 0 ? (
          <BrandsEmptyState searchQuery={filters.searchQuery} filters={filters} />
        ) : shouldUseVirtualScrolling ? (
          <VirtualBrandList
            brands={filteredBrands}
            onApply={handleApply}
            isApplying={isApplying}
            height={600}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <MemoizedBrandCard 
                key={brand.id} 
                brand={brand}
                onApply={handleApply}
                isApplying={isApplying}
                canApply={true}
              />
            ))}
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default ResellerBrandsContainer;
