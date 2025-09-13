import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, MessageSquare, Plus } from 'lucide-react';
import { FilterOptions } from '@/hooks/use-brand-filters';

interface QuickFilterButtonsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  suggestions: {
    needFollowUp: number;
    pendingCount: number;
    notAppliedCount: number;
    waitingLongCount: number;
  };
}

const QuickFilterButtons = ({ filters, onFiltersChange, suggestions }: QuickFilterButtonsProps) => {
  const setQuickFilter = (filterType: 'needFollowUp' | 'pending' | 'notApplied' | 'waitingLong') => {
    let newFilters: FilterOptions;
    
    switch (filterType) {
      case 'needFollowUp':
        newFilters = {
          searchQuery: '',
          applicationStatus: ['pending'],
          followUpActions: ['need_followup'],
          timeFilters: [],
        };
        break;
      case 'pending':
        newFilters = {
          searchQuery: '',
          applicationStatus: ['pending'],
          followUpActions: [],
          timeFilters: [],
        };
        break;
      case 'notApplied':
        newFilters = {
          searchQuery: '',
          applicationStatus: ['not_applied'],
          followUpActions: [],
          timeFilters: [],
        };
        break;
      case 'waitingLong':
        newFilters = {
          searchQuery: '',
          applicationStatus: ['pending'],
          followUpActions: [],
          timeFilters: ['waiting_long'],
        };
        break;
      default:
        return;
    }
    
    onFiltersChange(newFilters);
  };

  const isActive = (filterType: 'needFollowUp' | 'pending' | 'notApplied' | 'waitingLong') => {
    switch (filterType) {
      case 'needFollowUp':
        return filters.applicationStatus.includes('pending') && 
               filters.followUpActions.includes('need_followup');
      case 'pending':
        return filters.applicationStatus.includes('pending') && 
               filters.followUpActions.length === 0 && 
               filters.timeFilters.length === 0;
      case 'notApplied':
        return filters.applicationStatus.includes('not_applied');
      case 'waitingLong':
        return filters.applicationStatus.includes('pending') && 
               filters.timeFilters.includes('waiting_long');
      default:
        return false;
    }
  };

  return (
    <div className="bg-gray-50 border-b px-6 py-3">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Quick filters:</span>
          
          {/* Need Follow-up */}
          {suggestions.needFollowUp > 0 && (
            <Button
              variant={isActive('needFollowUp') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQuickFilter('needFollowUp')}
              className="h-8 gap-2"
            >
              <MessageSquare className="h-3 w-3" />
              Need Follow-up
              <Badge variant="secondary" className="ml-1 text-xs">
                {suggestions.needFollowUp}
              </Badge>
            </Button>
          )}

          {/* Pending Applications */}
          {suggestions.pendingCount > 0 && (
            <Button
              variant={isActive('pending') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQuickFilter('pending')}
              className="h-8 gap-2"
            >
              <Clock className="h-3 w-3" />
              Pending
              <Badge variant="secondary" className="ml-1 text-xs">
                {suggestions.pendingCount}
              </Badge>
            </Button>
          )}

          {/* Not Applied */}
          {suggestions.notAppliedCount > 0 && (
            <Button
              variant={isActive('notApplied') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQuickFilter('notApplied')}
              className="h-8 gap-2"
            >
              <Plus className="h-3 w-3" />
              Not Applied
              <Badge variant="secondary" className="ml-1 text-xs">
                {suggestions.notAppliedCount}
              </Badge>
            </Button>
          )}

          {/* Waiting Long */}
          {suggestions.waitingLongCount > 0 && (
            <Button
              variant={isActive('waitingLong') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQuickFilter('waitingLong')}
              className="h-8 gap-2"
            >
              <AlertCircle className="h-3 w-3" />
              Waiting Long
              <Badge variant="secondary" className="ml-1 text-xs">
                {suggestions.waitingLongCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickFilterButtons;