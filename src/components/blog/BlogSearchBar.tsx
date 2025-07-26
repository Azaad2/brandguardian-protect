import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { trackSearch, trackSEOInteraction } from '@/lib/analytics';

interface BlogSearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
  totalResults?: number;
  className?: string;
}

const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  onSearch,
  onFilterChange,
  totalResults = 0,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [suggestions] = useState([
    'Amazon brand approval',
    'MAP policy enforcement',
    'Unauthorized sellers',
    'Brand protection',
    'Reseller application',
    'Wholesale approval'
  ]);

  const popularFilters = [
    { label: 'Brand Protection', value: 'brand-protection' },
    { label: 'Amazon', value: 'amazon' },
    { label: 'Reseller Guides', value: 'reseller' },
    { label: 'MAP Policy', value: 'map-policy' },
    { label: 'Wholesale', value: 'wholesale' }
  ];

  useEffect(() => {
    onFilterChange(activeFilters);
  }, [activeFilters, onFilterChange]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      trackSearch(searchQuery, totalResults);
      trackSEOInteraction('Search', 'Blog', searchQuery);
    }
  };

  const handleFilterToggle = (filterValue: string) => {
    const newFilters = activeFilters.includes(filterValue)
      ? activeFilters.filter(f => f !== filterValue)
      : [...activeFilters, filterValue];
    
    setActiveFilters(newFilters);
    trackSEOInteraction('Filter_Toggle', 'Blog', filterValue);
  };

  const clearSearch = () => {
    setQuery('');
    setActiveFilters([]);
    onSearch('');
    trackSEOInteraction('Search_Clear', 'Blog', 'clear_all');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="search"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 pr-24"
          aria-label="Search blog articles"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {(query || activeFilters.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button 
            onClick={() => handleSearch()}
            size="sm"
            className="h-8"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {query.length === 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Popular searches:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 rounded-md transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2">
        <span className="text-sm font-medium text-muted-foreground">Filter by topic:</span>
        <div className="flex flex-wrap gap-2">
          {popularFilters.map((filter) => (
            <Badge
              key={filter.value}
              variant={activeFilters.includes(filter.value) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleFilterToggle(filter.value)}
            >
              {filter.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => {
            const filterLabel = popularFilters.find(f => f.value === filter)?.label || filter;
            return (
              <Badge
                key={filter}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => handleFilterToggle(filter)}
              >
                {filterLabel}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Results Count */}
      {totalResults > 0 && (
        <div className="text-sm text-muted-foreground">
          {totalResults} article{totalResults !== 1 ? 's' : ''} found
        </div>
      )}
    </div>
  );
};

export default BlogSearchBar;