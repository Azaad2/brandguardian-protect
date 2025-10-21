import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Search as SearchIcon, Building2, Store, Filter, X } from 'lucide-react';
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

interface Reseller {
  id: string;
  company_name: string;
  business_type: string;
  product_categories: string[];
  sales_volume: string;
  status: string;
}

type SearchResult = {
  type: 'brand' | 'reseller';
  data: Brand | Reseller;
  score: number;
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [entityType, setEntityType] = useState<'all' | 'brands' | 'resellers'>('all');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const allCategories = [
    'Cosmetics', 'Electronics', 'Home & Kitchen', 'Sports & Outdoors',
    'Toys & Games', 'Health & Personal Care', 'Automotive', 'Fashion'
  ];

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const calculateScore = (item: Brand | Reseller, searchQuery: string, type: 'brand' | 'reseller'): number => {
    let score = 0;
    const lowerQuery = searchQuery.toLowerCase();

    if (type === 'brand') {
      const brand = item as Brand;
      const name = brand.name?.toLowerCase() || '';
      const description = brand.description?.toLowerCase() || '';
      const categories = brand.categories?.map(c => c.toLowerCase()) || [];

      if (name === lowerQuery) score += 100;
      else if (name.includes(lowerQuery)) score += 50;

      if (description.includes(lowerQuery)) score += 10;

      if (categories.some(c => c.includes(lowerQuery))) score += 30;
    } else {
      const reseller = item as Reseller;
      const name = reseller.company_name?.toLowerCase() || '';
      const categories = reseller.product_categories?.map(c => c.toLowerCase()) || [];

      if (name === lowerQuery) score += 100;
      else if (name.includes(lowerQuery)) score += 50;

      if (categories.some(c => c.includes(lowerQuery))) score += 30;
    }

    return score;
  };

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const allResults: SearchResult[] = [];

      // Search brands
      if (entityType === 'all' || entityType === 'brands') {
        const { data: brands, error: brandsError } = await supabase
          .from('brands_directory')
          .select('*')
          .eq('is_active', true)
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);

        if (!brandsError && brands) {
          brands.forEach(brand => {
            // Apply category filter
            if (selectedCategories.length > 0) {
              const brandCategories = brand.categories || [];
              if (!selectedCategories.some(cat => brandCategories.includes(cat))) {
                return;
              }
            }

            const score = calculateScore(brand, searchQuery, 'brand');
            if (score > 0) {
              allResults.push({ type: 'brand', data: brand, score });
            }
          });
        }
      }

      // Search resellers
      if (entityType === 'all' || entityType === 'resellers') {
        const { data: resellers, error: resellersError } = await supabase
          .from('reseller_applications')
          .select('*')
          .eq('status', 'approved')
          .ilike('company_name', `%${searchQuery}%`);

        if (!resellersError && resellers) {
          resellers.forEach(reseller => {
            // Apply category filter
            if (selectedCategories.length > 0) {
              const resellerCategories = reseller.product_categories || [];
              if (!selectedCategories.some(cat => resellerCategories.includes(cat))) {
                return;
              }
            }

            const score = calculateScore(reseller, searchQuery, 'reseller');
            if (score > 0) {
              allResults.push({ type: 'reseller', data: reseller, score });
            }
          });
        }
      }

      // Sort by score
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
          <Button asChild size="sm">
            <Link to={`/reseller-hub?brand=${brand.name}`}>Apply to Partner</Link>
          </Button>
          {brand.website_url && (
            <Button asChild variant="outline" size="sm">
              <a href={brand.website_url} target="_blank" rel="noopener noreferrer">
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderResellerCard = (reseller: Reseller) => (
    <Card key={reseller.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Store className="w-10 h-10 text-muted-foreground" />
          <div className="flex-1">
            <CardTitle className="text-xl">{reseller.company_name}</CardTitle>
            <Badge variant="secondary" className="mt-1">Reseller</Badge>
            {reseller.product_categories && reseller.product_categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {reseller.product_categories.slice(0, 3).map(cat => (
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
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Type:</strong> {reseller.business_type}</p>
          <p><strong>Sales Volume:</strong> {reseller.sales_volume}</p>
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
                        id="resellers"
                        checked={entityType === 'resellers'}
                        onCheckedChange={() => setEntityType('resellers')}
                      />
                      <label htmlFor="resellers" className="text-sm cursor-pointer">Resellers</label>
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
                    : renderResellerCard(result.data as Reseller)
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
                    Enter a search term to find brands and resellers
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
