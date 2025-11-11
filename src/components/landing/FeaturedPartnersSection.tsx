import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Globe, MapPin, Star, ArrowRight, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedDistributor {
  id: string;
  company_name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  city: string | null;
  country_code: string | null;
  categories: string[] | null;
  featured_priority: number;
}

interface FeaturedBrand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  categories: string[] | null;
  featured_priority: number;
}

export const FeaturedPartnersSection = () => {
  const [distributors, setDistributors] = useState<FeaturedDistributor[]>([]);
  const [brands, setBrands] = useState<FeaturedBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPartners();
  }, []);

  const fetchFeaturedPartners = async () => {
    try {
      // Fetch featured distributors
      const { data: distributorsData, error: distError } = await supabase
        .from('distributors')
        .select('*')
        .eq('featured', true)
        .eq('verification_status', 'verified')
        .order('featured_priority', { ascending: false })
        .limit(6);

      if (distError) throw distError;

      // Fetch featured brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands_directory')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .order('featured_priority', { ascending: false })
        .limit(6);

      if (brandsError) throw brandsError;

      setDistributors(distributorsData || []);
      setBrands(brandsData || []);
    } catch (error) {
      console.error('Error fetching featured partners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  // Don't render if no featured partners
  if (distributors.length === 0 && brands.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Featured Partners
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Connect with verified distributors and premium brands on our platform
          </p>
        </div>

        {/* Featured Distributors */}
        {distributors.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                Featured Distributors
              </h3>
              <Link to="/search">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {distributors.map((distributor) => (
                <Card key={distributor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {distributor.logo_url ? (
                          <img 
                            src={distributor.logo_url} 
                            alt={distributor.company_name}
                            className="h-12 w-auto mb-3 object-contain"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <CardTitle className="text-lg mb-2">
                          {distributor.company_name}
                        </CardTitle>
                        {(distributor.city || distributor.country_code) && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 mr-1" />
                            {distributor.city && distributor.country_code 
                              ? `${distributor.city}, ${distributor.country_code}`
                              : distributor.city || distributor.country_code}
                          </div>
                        )}
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {distributor.description && (
                      <CardDescription className="mb-4 line-clamp-2">
                        {distributor.description}
                      </CardDescription>
                    )}
                    {distributor.categories && distributor.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {distributor.categories.slice(0, 3).map((category, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {distributor.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{distributor.categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {distributor.website_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          asChild
                        >
                          <a 
                            href={distributor.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                          </a>
                        </Button>
                      )}
                      <Button size="sm" className="flex-1">
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Featured Brands */}
        {brands.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Featured Brands
              </h3>
              <Link to="/search">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {brand.logo_url ? (
                          <img 
                            src={brand.logo_url} 
                            alt={brand.name}
                            className="h-12 w-auto mb-3 object-contain"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <CardTitle className="text-lg mb-2">
                          {brand.name}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {brand.description && (
                      <CardDescription className="mb-4 line-clamp-2">
                        {brand.description}
                      </CardDescription>
                    )}
                    {brand.categories && brand.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {brand.categories.slice(0, 3).map((category, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {brand.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{brand.categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {brand.website_url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          asChild
                        >
                          <a 
                            href={brand.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                          </a>
                        </Button>
                      )}
                      <Button size="sm" className="flex-1">
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
