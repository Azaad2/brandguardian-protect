import { useState } from 'react';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

export interface FilterOptions {
  searchQuery: string;
  applicationStatus: string[];
  followUpActions: string[];
  timeFilters: string[];
}

interface BrandsFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  filteredBrandsCount: number;
  totalBrandsCount: number;
}

const APPLICATION_STATUS_OPTIONS = [
  { value: 'not_applied', label: 'Not Applied Yet', color: 'bg-gray-100 text-gray-800' },
  { value: 'pending', label: 'Application Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Application Approved', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Application Rejected', color: 'bg-red-100 text-red-800' },
];

const FOLLOW_UP_OPTIONS = [
  { value: 'need_followup', label: 'Need Follow-up', color: 'bg-orange-100 text-orange-800' },
  { value: 'followup_sent', label: 'Follow-up Sent', color: 'bg-blue-100 text-blue-800' },
  { value: 'max_followups', label: 'Max Follow-ups Reached', color: 'bg-purple-100 text-purple-800' },
];

const TIME_FILTER_OPTIONS = [
  { value: 'recently_applied', label: 'Recently Applied (7 days)', color: 'bg-green-100 text-green-800' },
  { value: 'waiting_long', label: 'Waiting Long (14+ days)', color: 'bg-red-100 text-red-800' },
  { value: 'response_overdue', label: 'Response Overdue', color: 'bg-orange-100 text-orange-800' },
];

const BrandsFilter = ({ filters, onFiltersChange, filteredBrandsCount, totalBrandsCount }: BrandsFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleStatusToggle = (status: string) => {
    const newStatuses = filters.applicationStatus.includes(status)
      ? filters.applicationStatus.filter(s => s !== status)
      : [...filters.applicationStatus, status];
    onFiltersChange({ ...filters, applicationStatus: newStatuses });
  };

  const handleFollowUpToggle = (action: string) => {
    const newActions = filters.followUpActions.includes(action)
      ? filters.followUpActions.filter(a => a !== action)
      : [...filters.followUpActions, action];
    onFiltersChange({ ...filters, followUpActions: newActions });
  };

  const handleTimeFilterToggle = (timeFilter: string) => {
    const newTimeFilters = filters.timeFilters.includes(timeFilter)
      ? filters.timeFilters.filter(t => t !== timeFilter)
      : [...filters.timeFilters, timeFilter];
    onFiltersChange({ ...filters, timeFilters: newTimeFilters });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      searchQuery: '',
      applicationStatus: [],
      followUpActions: [],
      timeFilters: [],
    });
  };

  const activeFiltersCount = filters.applicationStatus.length + filters.followUpActions.length + filters.timeFilters.length;
  const hasActiveFilters = activeFiltersCount > 0 || filters.searchQuery;

  const getFilterLabel = (type: string, value: string) => {
    const allOptions = [...APPLICATION_STATUS_OPTIONS, ...FOLLOW_UP_OPTIONS, ...TIME_FILTER_OPTIONS];
    return allOptions.find(opt => opt.value === value)?.label || value;
  };

  const getFilterColor = (type: string, value: string) => {
    const allOptions = [...APPLICATION_STATUS_OPTIONS, ...FOLLOW_UP_OPTIONS, ...TIME_FILTER_OPTIONS];
    return allOptions.find(opt => opt.value === value)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 space-y-4">
      <div className="max-w-7xl mx-auto">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search brands, departments, or categories..." 
              className="pl-10 h-11"
              value={filters.searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className={`h-11 ${activeFiltersCount > 0 ? 'border-blue-500 bg-blue-50' : ''}`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white">
                    {activeFiltersCount}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Filters</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      <X className="h-3 w-3 mr-1" />
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Application Status */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Application Status</h5>
                  <div className="space-y-2">
                    {APPLICATION_STATUS_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.applicationStatus.includes(option.value)}
                          onCheckedChange={() => handleStatusToggle(option.value)}
                        />
                        <label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Follow-up Actions */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Follow-up Actions</h5>
                  <div className="space-y-2">
                    {FOLLOW_UP_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.followUpActions.includes(option.value)}
                          onCheckedChange={() => handleFollowUpToggle(option.value)}
                        />
                        <label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Time-based Filters */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Timing</h5>
                  <div className="space-y-2">
                    {TIME_FILTER_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.timeFilters.includes(option.value)}
                          onCheckedChange={() => handleTimeFilterToggle(option.value)}
                        />
                        <label htmlFor={option.value} className="text-sm cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Results Count */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">
              {filteredBrandsCount} of {totalBrandsCount} brands
            </span>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {filters.searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{filters.searchQuery}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleSearchChange('')}
                />
              </Badge>
            )}

            {filters.applicationStatus.map((status) => (
              <Badge 
                key={status} 
                className={`gap-1 ${getFilterColor('status', status)}`}
              >
                {getFilterLabel('status', status)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleStatusToggle(status)}
                />
              </Badge>
            ))}

            {filters.followUpActions.map((action) => (
              <Badge 
                key={action} 
                className={`gap-1 ${getFilterColor('followup', action)}`}
              >
                {getFilterLabel('followup', action)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleFollowUpToggle(action)}
                />
              </Badge>
            ))}

            {filters.timeFilters.map((timeFilter) => (
              <Badge 
                key={timeFilter} 
                className={`gap-1 ${getFilterColor('time', timeFilter)}`}
              >
                {getFilterLabel('time', timeFilter)}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => handleTimeFilterToggle(timeFilter)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsFilter;