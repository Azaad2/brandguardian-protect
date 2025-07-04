
import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { useBrandApplications } from '@/hooks/use-brand-applications';
import UsageIndicator from '@/components/reseller/subscription/UsageIndicator';
import SubscriptionUpgrade from '@/components/reseller/subscription/SubscriptionUpgrade';
import SubscriptionManager from '@/components/reseller/subscription/SubscriptionManager';
import BrandsHeader from './components/BrandsHeader';
import BrandsSearchBar from './components/BrandsSearchBar';
import BrandCard from './components/BrandCard';
import BrandsLoadingState from './components/BrandsLoadingState';
import BrandsErrorState from './components/BrandsErrorState';
import BrandsEmptyState from './components/BrandsEmptyState';
import { useResellerBrands } from '@/hooks/use-reseller-brands';

const ResellerBrandsContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { data: applications } = useBrandApplications();
  const { data: brands, isLoading, error } = useResellerBrands();

  const currentApplications = applications?.length || 0;
  const limit = subscription?.brand_application_limit || 3;
  const isAtLimit = currentApplications >= limit;

  if (subscriptionLoading || isLoading) {
    return <BrandsLoadingState />;
  }

  if (error) {
    return <BrandsErrorState error={error.message} />;
  }

  const filteredBrands = brands?.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Show upgrade component if user is at limit and on free plan
  const showUpgrade = isAtLimit && (!subscription?.subscribed || subscription.subscription_tier === 'free');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BrandsHeader />
      
      {/* Subscription Status */}
      <UsageIndicator 
        currentApplications={currentApplications}
        limit={limit}
        subscriptionTier={subscription?.subscription_tier || 'free'}
      />
      
      {/* Subscription Management */}
      {subscription?.subscribed && <SubscriptionManager />}
      
      {/* Upgrade Component */}
      {showUpgrade ? (
        <SubscriptionUpgrade 
          currentApplications={currentApplications}
          currentLimit={limit}
        />
      ) : (
        <>
          <BrandsSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          
          {filteredBrands.length === 0 ? (
            <BrandsEmptyState hasSearchTerm={!!searchTerm} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrands.map((brand) => (
                <BrandCard 
                  key={brand.id} 
                  brand={brand} 
                  isAtLimit={isAtLimit}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResellerBrandsContainer;
