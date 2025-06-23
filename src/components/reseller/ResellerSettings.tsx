
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import ResellerProfileHeader from "./settings/ResellerProfileHeader";
import BusinessInformationCard from "./settings/BusinessInformationCard";
import ContactInformationCard from "./settings/ContactInformationCard";
import MarketplaceInformationCard from "./settings/MarketplaceInformationCard";
import SalesPerformanceCard from "./settings/SalesPerformanceCard";
import ProductCategoriesCard from "./settings/ProductCategoriesCard";
import { 
  formatBusinessType, 
  formatSalesVolume, 
  formatWholesaleBudget, 
  formatProductCategories 
} from "./settings/utils/formatters";
import { getStatusBadge } from "./settings/utils/statusHelpers";

interface ResellerProfile {
  id: string;
  company_name: string;
  business_type: string;
  ein_number: string;
  amazon_seller_id: string;
  walmart_seller_id: string;
  ebay_seller_id: string;
  product_categories: string[];
  sales_volume: string;
  wholesale_budget: string;
  feedback_score: string;
  email: string;
  phone: string;
  linkedin: string;
  status: string;
  created_at: string;
}

const ResellerSettings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ResellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResellerProfile = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('reseller_applications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching reseller profile:', error);
          setError('Failed to load profile information');
          return;
        }

        setProfile(data);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResellerProfile();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-xl font-semibold">Loading Profile...</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reseller profile found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Your application may still be processing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <ResellerProfileHeader profile={profile} getStatusBadge={getStatusBadge} />
        </CardHeader>
        <CardContent className="space-y-6">
          <BusinessInformationCard profile={profile} formatBusinessType={formatBusinessType} />
          <ContactInformationCard profile={profile} />
          <MarketplaceInformationCard profile={profile} />
          <SalesPerformanceCard 
            profile={profile} 
            formatSalesVolume={formatSalesVolume} 
            formatWholesaleBudget={formatWholesaleBudget} 
          />
          <ProductCategoriesCard 
            profile={profile} 
            formatProductCategories={formatProductCategories} 
          />

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Application submitted: {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerSettings;
