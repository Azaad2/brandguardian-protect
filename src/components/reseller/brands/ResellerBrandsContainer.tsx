
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
  const limit = 999999; // Unlimited applications
  const isAtLimit = false; // Never at limit

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

  // Show upgrade component for premium features, not application limits
  const showUpgrade = !subscription?.subscribed && subscription?.subscription_tier === 'free';

  // Transform brand data to match BrandCard interface
  const transformedBrands = filteredBrands.map(brand => ({
    id: brand.id,
    name: brand.name,
    website_url: brand.website_url,
    description: brand.description,
    contact_email: brand.contact_email,
    logo_url: brand.logo_url,
    categories: brand.categories || [],
    is_active: brand.is_active,
    department: brand.department,
    approval_rate: brand.approval_rate,
    response_time: brand.response_time,
    created_at: brand.created_at,
    updated_at: brand.updated_at,
    applicationStatus: brand.applicationStatus,
    application: brand.application,
    // Helper properties for display
    displayName: brand.name,
    displayDepartment: brand.department || brand.categories?.[0],
  }));

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
              canApply={true} // Always allow applications
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResellerBrandsContainer;
