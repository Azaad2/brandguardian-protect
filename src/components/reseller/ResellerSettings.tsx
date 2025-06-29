
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import ResellerProfileHeader from './settings/ResellerProfileHeader';
import ContactInformationCard from './settings/ContactInformationCard';
import BusinessInformationCard from './settings/BusinessInformationCard';
import MarketplaceInformationCard from './settings/MarketplaceInformationCard';
import SalesPerformanceCard from './settings/SalesPerformanceCard';
import ProductCategoriesCard from './settings/ProductCategoriesCard';
import PasswordChangeCard from './settings/PasswordChangeCard';
import { getStatusBadge } from './settings/utils/statusHelpers';
import { 
  formatBusinessType, 
  formatSalesVolume, 
  formatWholesaleBudget, 
  formatProductCategories 
} from './settings/utils/formatters';

interface ResellerProfile {
  id: string;
  company_name: string;
  business_type: string;
  ein_number: string;
  amazon_seller_id?: string;
  walmart_seller_id?: string;
  ebay_seller_id?: string;
  product_categories: string[];
  sales_volume: string;
  wholesale_budget?: string;
  feedback_score?: string;
  email: string;
  phone: string;
  linkedin?: string;
  status: string;
}

const ResellerSettings = () => {
  const [profile, setProfile] = useState<ResellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResellerProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            variant: 'destructive',
            title: 'Authentication required',
            description: 'Please log in to view your profile.',
          });
          return;
        }

        // First get the profile to check user role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', user.id)
          .single();

        if (profileError || profileData?.user_role !== 'reseller') {
          toast({
            variant: 'destructive',
            title: 'Access denied',
            description: 'You must be a reseller to access this page.',
          });
          return;
        }

        // Get the reseller application data
        const { data: applicationData, error: applicationError } = await supabase
          .from('reseller_applications')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (applicationError) {
          console.error('Error fetching reseller profile:', applicationError);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to load reseller profile.',
          });
          return;
        }

        setProfile({
          id: applicationData.id,
          company_name: applicationData.company_name,
          business_type: applicationData.business_type,
          ein_number: applicationData.ein_number,
          amazon_seller_id: applicationData.amazon_seller_id,
          walmart_seller_id: applicationData.walmart_seller_id,
          ebay_seller_id: applicationData.ebay_seller_id,
          product_categories: applicationData.product_categories || [],
          sales_volume: applicationData.sales_volume,
          wholesale_budget: applicationData.wholesale_budget,
          feedback_score: applicationData.feedback_score,
          email: applicationData.email,
          phone: applicationData.phone,
          linkedin: applicationData.linkedin,
          status: applicationData.status || 'pending'
        });

      } catch (error) {
        console.error('Error fetching reseller profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load reseller profile.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResellerProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>No reseller profile found. Please contact support.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <ResellerProfileHeader profile={profile} getStatusBadge={getStatusBadge} />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <ContactInformationCard profile={profile} />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <MarketplaceInformationCard profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="business" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <BusinessInformationCard 
                profile={profile} 
                formatBusinessType={formatBusinessType} 
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <SalesPerformanceCard 
                profile={profile} 
                formatSalesVolume={formatSalesVolume}
                formatWholesaleBudget={formatWholesaleBudget}
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <ProductCategoriesCard 
                profile={profile} 
                formatProductCategories={formatProductCategories} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <PasswordChangeCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerSettings;
