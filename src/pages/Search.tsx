import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search as SearchIcon, Building2, Store, Filter, X, MapPin, Truck, Mail } from 'lucide-react';
import ContactAccessDialog from '@/components/dialogs/ContactAccessDialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdvancedSEO from '@/components/seo/AdvancedSEO';

interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  categories: string[] | null;
  contact_email: string;
  website_url: string | null;
  department: string | null;
}

interface Distributor {
  id: string;
  company_name: string;
  description: string | null;
  logo_url: string | null;
  categories: string[] | null;
  brands_carried: string[] | null;
  business_type: string | null;
  city: string | null;
  state_province: string | null;
  country_code: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  verification_status: string | null;
}

type SearchResult = {
  type: 'brand' | 'distributor';
  data: Brand | Distributor;
  score: number;
  matchedKeywords?: string[];
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [entityType, setEntityType] = useState<'all' | 'brands' | 'distributors'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{
    email?: string;
    phone?: string;
    name: string;
    type: 'brand' | 'distributor';
  } | null>(null);

  const allCategories = [
    'Beauty & Personal Care', 'Consumer Electronics', 'Home & Kitchen', 'Sports & Outdoors',
    'Toys & Games', 'Health & Wellness', 'Automotive', 'Fashion & Apparel', 'Food & Beverage'
  ];

  // Category synonyms for fuzzy matching
  const categorySynonyms: Record<string, string[]> = {
    'cosmetics': ['Beauty & Personal Care', 'Health & Wellness'],
    'beauty': ['Beauty & Personal Care'],
    'electronics': ['Consumer Electronics'],
    'tech': ['Consumer Electronics'],
    'food': ['Food & Beverage'],
    'beverage': ['Food & Beverage'],
    'fashion': ['Fashion & Apparel'],
    'clothing': ['Fashion & Apparel'],
    'apparel': ['Fashion & Apparel']
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const calculateScore = (
    item: Brand | Distributor,
    keywords: string[],
    type: 'brand' | 'distributor'
  ): { score: number; matchedKeywords: string[] } => {
    let score = 0;
    const matchedKeywords: string[] = [];

    if (type === 'brand') {
      const brand = item as Brand;
      const name = brand.name?.toLowerCase() || '';
      const description = brand.description?.toLowerCase() || '';
      const categories = brand.categories?.map(c => c.toLowerCase()) || [];
      const department = brand.department?.toLowerCase() || '';

      keywords.forEach(keyword => {
        const lower = keyword.toLowerCase();
        
        // Exact name match (highest priority)
        if (name === lower) {
          score += 100;
          matchedKeywords.push(keyword);
        } else if (name.includes(lower)) {
          score += 50;
          matchedKeywords.push(keyword);
        }

        // Category matching with synonyms
        const synonymMatches = categorySynonyms[lower] || [];
        if (categories.some(c => c.includes(lower) || synonymMatches.some(syn => c.toLowerCase().includes(syn.toLowerCase())))) {
          score += 30;
          matchedKeywords.push(keyword);
        }

        // Department match
        if (department.includes(lower)) {
          score += 25;
          matchedKeywords.push(keyword);
        }

        // Description match (lowest priority)
        if (description.includes(lower)) {
          score += 10;
          matchedKeywords.push(keyword);
        }
      });
    } else {
      const distributor = item as Distributor;
      const name = distributor.company_name?.toLowerCase() || '';
      const description = distributor.description?.toLowerCase() || '';
      const categories = distributor.categories?.map(c => c.toLowerCase()) || [];
      const brands = distributor.brands_carried?.map(b => b.toLowerCase()) || [];
      const city = distributor.city?.toLowerCase() || '';
      const state = distributor.state_province?.toLowerCase() || '';
      const country = distributor.country_code?.toLowerCase() || '';

      keywords.forEach(keyword => {
        const lower = keyword.toLowerCase();
        
        // Exact name match
        if (name === lower) {
          score += 100;
          matchedKeywords.push(keyword);
        } else if (name.includes(lower)) {
          score += 50;
          matchedKeywords.push(keyword);
        }

        // Category matching with synonyms
        const synonymMatches = categorySynonyms[lower] || [];
        if (categories.some(c => c.includes(lower) || synonymMatches.some(syn => c.toLowerCase().includes(syn.toLowerCase())))) {
          score += 30;
          matchedKeywords.push(keyword);
        }

        // Brand carried match
        if (brands.some(b => b.includes(lower))) {
          score += 25;
          matchedKeywords.push(keyword);
        }

        // Location matching (handle variations)
        const isLocationKeyword = ['us', 'usa', 'united states', 'uk', 'united kingdom'].includes(lower) ||
                                   city.includes(lower) || state.includes(lower) || country.includes(lower);
        if (isLocationKeyword) {
          if (lower === 'us' || lower === 'usa' || lower === 'united states') {
            if (country === 'us' || country === 'usa' || country === 'united states') {
              score += 20;
              matchedKeywords.push(keyword);
            }
          } else {
            score += 20;
            matchedKeywords.push(keyword);
          }
        }

        // Description match
        if (description.includes(lower)) {
          score += 10;
          matchedKeywords.push(keyword);
        }
      });
    }

    return { score, matchedKeywords: [...new Set(matchedKeywords)] };
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const allResults: SearchResult[] = [];
      
      // Split query into keywords for intelligent matching
      const keywords = searchQuery.trim().split(/\s+/).filter(k => k.length > 0);

      // Search brands
      if (entityType === 'all' || entityType === 'brands') {
        const { data: brands, error: brandsError } = await supabase
          .from('brands_directory')
          .select('*')
          .eq('is_active', true);

        if (!brandsError && brands) {
          brands.forEach(brand => {
            // Apply category filter
            if (selectedCategories.length > 0) {
              const brandCategories = brand.categories || [];
              if (!selectedCategories.some(cat => brandCategories.includes(cat))) {
                return;
              }
            }

            const { score, matchedKeywords } = calculateScore(brand, keywords, 'brand');
            if (score > 0) {
              allResults.push({ type: 'brand', data: brand, score, matchedKeywords });
            }
          });
        }
      }

      // Search distributors
      if (entityType === 'all' || entityType === 'distributors') {
        const { data: distributors, error: distributorsError } = await supabase
          .from('distributors')
          .select('*')
          .eq('verification_status', 'verified');

        if (!distributorsError && distributors) {
          distributors.forEach(distributor => {
            // Apply category filter
            if (selectedCategories.length > 0) {
              const distCategories = distributor.categories || [];
              if (!selectedCategories.some(cat => distCategories.includes(cat))) {
                return;
              }
            }

            const { score, matchedKeywords } = calculateScore(distributor, keywords, 'distributor');
            if (score > 0) {
              allResults.push({ type: 'distributor', data: distributor, score, matchedKeywords });
            }
          });
        }
      }

      // Sort by score (highest first)
      allResults.sort((a, b) => b.score - a.score);
      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setEntityType('all');
    setSelectedCategories([]);
  };

  // Re-filter results when filters change
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [entityType, selectedCategories]);

  const handleContactClick = (email?: string, phone?: string, name?: string, type?: 'brand' | 'distributor') => {
    setSelectedContact({
      email,
      phone,
      name: name || 'this entity',
      type: type || 'brand',
    });
    setContactDialogOpen(true);
  };

  const renderBrandCard = (brand: Brand) => (
    <Card key={brand.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-10 h-10 rounded object-cover" />
              ) : (
                <Building2 className="w-10 h-10 text-muted-foreground" />
              )}
              <div>
                <CardTitle className="text-xl">{brand.name}</CardTitle>
                <Badge variant="secondary" className="mt-1">Brand</Badge>
              </div>
            </div>
            {brand.categories && brand.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {brand.categories.slice(0, 3).map(cat => (
                  <Badge key={cat} variant="outline" className="text-xs">
                    {cat}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {brand.description && (
          <CardDescription className="mb-4 line-clamp-2">
            {brand.description}
          </CardDescription>
        )}
        <div className="flex gap-2">
          {brand.contact_email && (
            <Button 
              size="sm" 
              onClick={() => handleContactClick(brand.contact_email, undefined, brand.name, 'brand')}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          )}
          {brand.website_url && (
            <Button asChild variant="outline" size="sm">
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to={`/reseller-hub?brand=${brand.name}`}>Apply to Partner</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDistributorCard = (distributor: Distributor) => (
    <Card key={distributor.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {distributor.logo_url ? (
                <img src={distributor.logo_url} alt={distributor.company_name} className="w-10 h-10 rounded object-cover" />
              ) : (
                <Truck className="w-10 h-10 text-muted-foreground" />
              )}
              <div>
                <CardTitle className="text-xl">{distributor.company_name}</CardTitle>
                <Badge variant="secondary" className="mt-1">Distributor</Badge>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {distributor.city && distributor.state_province && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  {distributor.city}, {distributor.state_province}
                </Badge>
              )}
              {distributor.categories && distributor.categories.length > 0 && (
                <>
                  {distributor.categories.slice(0, 2).map(cat => (
                    <Badge key={cat} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {distributor.description && (
          <CardDescription className="mb-4 line-clamp-2">
            {distributor.description}
          </CardDescription>
        )}
        {distributor.brands_carried && distributor.brands_carried.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Brands Carried:</p>
            <div className="flex flex-wrap gap-1">
              {distributor.brands_carried.slice(0, 4).map(brand => (
                <Badge key={brand} variant="secondary" className="text-xs">
                  {brand}
                </Badge>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2">
          {distributor.contact_email && (
            <Button 
              size="sm"
              onClick={() => handleContactClick(
                distributor.contact_email || undefined, 
                distributor.contact_phone || undefined, 
                distributor.company_name,
                'distributor'
              )}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact
            </Button>
          )}
          {distributor.website_url && (
            <Button asChild variant="outline" size="sm">
              <a href={distributor.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AdvancedSEO
        title={query ? `Search Results for "${query}"` : 'Search'}
        description={`Find brands and resellers matching "${query}". Connect with verified partners in the BndBox marketplace.`}
        keywords={`search, ${query}, brands, resellers, marketplace`}
        canonicalUrl={`https://bndbox.com/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
        ogType="website"
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for brands, resellers, or categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
            <Button type="submit" size="lg" className="px-8">
              Search
            </Button>
          </form>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden lg:block'} w-full lg:w-64 space-y-6`}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Entity Type */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Type</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="all"
                        checked={entityType === 'all'}
                        onCheckedChange={() => setEntityType('all')}
                      />
                      <label htmlFor="all" className="text-sm cursor-pointer">All</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="brands"
                        checked={entityType === 'brands'}
                        onCheckedChange={() => setEntityType('brands')}
                      />
                      <label htmlFor="brands" className="text-sm cursor-pointer">Brands</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="distributors"
                        checked={entityType === 'distributors'}
                        onCheckedChange={() => setEntityType('distributors')}
                      />
                      <label htmlFor="distributors" className="text-sm cursor-pointer">Distributors</label>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Categories</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allCategories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {query && (
                  <>
                    Results for "<span className="text-primary">{query}</span>"
                    {!isLoading && <span className="text-muted-foreground ml-2">({results.length})</span>}
                  </>
                )}
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-12 w-12 rounded mb-2" />
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {results.map(result =>
                  result.type === 'brand'
                    ? renderBrandCard(result.data as Brand)
                    : renderDistributorCard(result.data as Distributor)
                )}
              </div>
            ) : query ? (
              <Card className="text-center py-12">
                <CardContent>
                  <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Start searching</h3>
                  <p className="text-muted-foreground">
                    Enter a search term to find brands and distributors
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {selectedContact && (
        <ContactAccessDialog
          open={contactDialogOpen}
          onOpenChange={setContactDialogOpen}
          contactEmail={selectedContact.email}
          contactPhone={selectedContact.phone}
          entityName={selectedContact.name}
          entityType={selectedContact.type}
        />
      )}

      <Footer />
    </div>
  );
};

export default Search;
