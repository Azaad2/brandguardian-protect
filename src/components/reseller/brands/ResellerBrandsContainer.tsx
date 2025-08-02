
import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { useBrandApplications, useAvailableBrands } from '@/hooks/use-brand-applications';
import UsageIndicator from '@/components/reseller/subscription/UsageIndicator';
import SubscriptionUpgrade from '@/components/reseller/subscription/SubscriptionUpgrade';
import SubscriptionManager from '@/components/reseller/subscription/SubscriptionManager';
import BrandsHeader from './components/BrandsHeader';
import BrandsSearchBar from './components/BrandsSearchBar';
import BrandCard from './components/BrandCard';
import BrandsLoadingState from './components/BrandsLoadingState';
import BrandsErrorState from './components/BrandsErrorState';
import BrandsEmptyState from './components/BrandsEmptyState';

const ResellerBrandsContainer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { subscription, isLoading: subscriptionLoading } = useSubscription();
  const { applications, applyToBrand, isApplying } = useBrandApplications();
  const { data: availableBrands, isLoading, error } = useAvailableBrands();

  const currentApplications = applications?.length || 0;
  const limit = subscription?.brand_application_limit || 3;
  const isAtLimit = currentApplications >= limit;

  if (subscriptionLoading || isLoading) {
    return <BrandsLoadingState />;
  }

  if (error) {
    return <BrandsErrorState error={error} />;
  }

  const filteredBrands = availableBrands?.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  // Show upgrade component if user is at limit and on free plan
  const showUpgrade = isAtLimit && (!subscription?.subscribed || subscription.subscription_tier === 'free');

  // Transform brand data to match BrandCard interface
  const transformedBrands = filteredBrands.map(brand => ({
    id: brand.id, // Use the actual brand ID from database
    displayName: brand.name,
    displayDepartment: brand.department || brand.categories?.[0],
    contact_email: brand.contact_email,
    categories: brand.categories || [],
    description: brand.description,
    approval_rate: brand.approval_rate,
    response_time: brand.response_time,
    applicationStatus: brand.applicationStatus
  }));

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
          <BrandsSearchBar 
            searchQuery={searchTerm} 
            setSearchQuery={setSearchTerm}
            filteredBrandsCount={filteredBrands.length}
          />
          
          {filteredBrands.length === 0 ? (
            <BrandsEmptyState searchQuery={searchTerm} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedBrands.map((brand) => (
                <BrandCard 
                  key={brand.id} 
                  brand={brand}
                  onApply={(brandId) => applyToBrand({ brandId })}
                  isApplying={isApplying}
                  canApply={!isAtLimit}
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
