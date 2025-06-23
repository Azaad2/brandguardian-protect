import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Building, Mail, Phone, Globe, DollarSign, TrendingUp, Package } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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

  const formatBusinessType = (type: string) => {
    const types: { [key: string]: string } = {
      individual: 'Individual',
      corporation: 'Corporation',
      partnership: 'Partnership',
      llc: 'LLC',
      other: 'Other'
    };
    return types[type] || type;
  };

  const formatSalesVolume = (volume: string) => {
    const volumes: { [key: string]: string } = {
      under_10k: 'Under $10,000',
      '10k_50k': '$10,000 - $50,000',
      '50k_100k': '$50,000 - $100,000',
      '100k_500k': '$100,000 - $500,000',
      '500k_1m': '$500,000 - $1 million',
      over_1m: 'Over $1 million'
    };
    return volumes[volume] || volume;
  };

  const formatWholesaleBudget = (budget: string) => {
    const budgets: { [key: string]: string } = {
      under_5k: 'Under $5,000',
      '5k_10k': '$5,000 - $10,000',
      '10k_25k': '$10,000 - $25,000',
      '25k_50k': '$25,000 - $50,000',
      '50k_100k': '$50,000 - $100,000',
      over_100k: 'Over $100,000'
    };
    return budgets[budget] || budget;
  };

  const formatProductCategories = (categories: string[]) => {
    const categoryMap: { [key: string]: string } = {
      electronics: 'Electronics',
      beauty: 'Beauty',
      home_goods: 'Home Goods',
      fashion: 'Fashion',
      toys: 'Toys',
      sports: 'Sports',
      automotive: 'Automotive',
      health: 'Health',
      grocery: 'Grocery',
      books: 'Books',
      other: 'Other'
    };
    return categories.map(cat => categoryMap[cat] || cat);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">✓ Approved</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">✗ Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading Profile...</CardTitle>
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {profile.company_name}
            </CardTitle>
            {getStatusBadge(profile.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building className="h-4 w-4" />
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                <p className="text-sm">{profile.company_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Type</label>
                <p className="text-sm">{formatBusinessType(profile.business_type)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">EIN Number</label>
                <p className="text-sm">{profile.ein_number}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{profile.phone}</p>
              </div>
              {profile.linkedin && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">LinkedIn</label>
                  <p className="text-sm">{profile.linkedin}</p>
                </div>
              )}
            </div>
          </div>

          {/* Marketplace Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Marketplace Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.amazon_seller_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Amazon Seller ID</label>
                  <p className="text-sm">{profile.amazon_seller_id}</p>
                </div>
              )}
              {profile.walmart_seller_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Walmart Seller ID</label>
                  <p className="text-sm">{profile.walmart_seller_id}</p>
                </div>
              )}
              {profile.ebay_seller_id && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">eBay Seller ID</label>
                  <p className="text-sm">{profile.ebay_seller_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sales Performance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Sales Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Monthly Sales Volume</label>
                <p className="text-sm">{formatSalesVolume(profile.sales_volume)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wholesale Budget</label>
                <p className="text-sm">{formatWholesaleBudget(profile.wholesale_budget)}</p>
              </div>
              {profile.feedback_score && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Feedback Score</label>
                  <p className="text-sm">{profile.feedback_score}</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {formatProductCategories(profile.product_categories).map((category, index) => (
                <Badge key={index} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Application Date */}
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
