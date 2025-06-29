
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ResellerProfileHeader from './settings/ResellerProfileHeader';
import ContactInformationCard from './settings/ContactInformationCard';
import BusinessInformationCard from './settings/BusinessInformationCard';
import MarketplaceInformationCard from './settings/MarketplaceInformationCard';
import SalesPerformanceCard from './settings/SalesPerformanceCard';
import ProductCategoriesCard from './settings/ProductCategoriesCard';
import PasswordChangeCard from './settings/PasswordChangeCard';

const ResellerSettings = () => {
  return (
    <div className="space-y-6">
      <ResellerProfileHeader />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ContactInformationCard />
          <MarketplaceInformationCard />
        </TabsContent>
        
        <TabsContent value="business" className="space-y-6">
          <BusinessInformationCard />
          <SalesPerformanceCard />
          <ProductCategoriesCard />
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <PasswordChangeCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerSettings;
