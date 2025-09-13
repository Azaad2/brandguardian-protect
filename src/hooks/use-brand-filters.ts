import { useState, useMemo } from 'react';
import { useFollowUp } from '@/hooks/use-follow-up';

export interface FilterOptions {
  searchQuery: string;
  applicationStatus: string[];
  followUpActions: string[];
  timeFilters: string[];
}

interface Brand {
  id: string;
  name: string;
  website_url?: string;
  description?: string;
  contact_email: string;
  logo_url?: string;
  categories?: string[];
  is_active: boolean;
  department?: string;
  approval_rate?: number;
  response_time?: number;
  created_at: string;
  updated_at: string;
  applicationStatus?: string | null;
  application?: {
    id: string;
    created_at: string;
    follow_up_count: number;
    last_follow_up_at?: string | null;
    status: string;
  };
  displayName: string;
  displayDepartment?: string;
}

export const useBrandFilters = (brands: Brand[] = []) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    applicationStatus: [],
    followUpActions: [],
    timeFilters: [],
  });

  const { canSendFollowUp, getDaysSinceApplication, getDaysSinceLastActivity } = useFollowUp();

  const filteredBrands = useMemo(() => {
    return brands.filter(brand => {
      // Text search filter
      if (filters.searchQuery) {
        const searchTerm = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          brand.name.toLowerCase().includes(searchTerm) ||
          brand.department?.toLowerCase().includes(searchTerm) ||
          brand.categories?.some(cat => cat.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Application Status filters
      if (filters.applicationStatus.length > 0) {
        const hasApplication = brand.applicationStatus !== null;
        const currentStatus = brand.applicationStatus || 'not_applied';
        
        const statusMatch = filters.applicationStatus.some(filterStatus => {
          if (filterStatus === 'not_applied' && !hasApplication) return true;
          if (filterStatus === currentStatus) return true;
          return false;
        });
        
        if (!statusMatch) return false;
      }

      // Follow-up Action filters
      if (filters.followUpActions.length > 0) {
        const application = brand.application;
        if (!application || application.status !== 'pending') {
          // If filtering for follow-up actions but no pending application, exclude
          return false;
        }

        const followUpMatch = filters.followUpActions.some(filterAction => {
          switch (filterAction) {
            case 'need_followup':
              return canSendFollowUp(application);
            case 'followup_sent':
              return application.follow_up_count > 0;
            case 'max_followups':
              return application.follow_up_count >= 3;
            default:
              return false;
          }
        });
        
        if (!followUpMatch) return false;
      }

      // Time-based filters
      if (filters.timeFilters.length > 0) {
        const application = brand.application;
        if (!application) {
          // If filtering by time but no application, exclude
          return false;
        }

        const daysSinceApplication = getDaysSinceApplication(application.created_at);
        const daysSinceLastActivity = getDaysSinceLastActivity(
          application.created_at,
          application.last_follow_up_at
        );

        const timeMatch = filters.timeFilters.some(timeFilter => {
          switch (timeFilter) {
            case 'recently_applied':
              return daysSinceApplication <= 7;
            case 'waiting_long':
              return daysSinceApplication >= 14;
            case 'response_overdue':
              // Consider overdue if more than 3 days since last activity and status is pending
              return application.status === 'pending' && daysSinceLastActivity >= 3;
            default:
              return false;
          }
        });
        
        if (!timeMatch) return false;
      }

      return true;
    });
  }, [brands, filters, canSendFollowUp, getDaysSinceApplication, getDaysSinceLastActivity]);

  // Calculate filter suggestions based on current data
  const filterSuggestions = useMemo(() => {
    const needFollowUp = brands.filter(brand => 
      brand.application && 
      brand.application.status === 'pending' && 
      canSendFollowUp(brand.application)
    ).length;

    const pendingCount = brands.filter(brand => 
      brand.applicationStatus === 'pending'
    ).length;

    const notAppliedCount = brands.filter(brand => 
      !brand.applicationStatus
    ).length;

    const waitingLongCount = brands.filter(brand => {
      if (!brand.application) return false;
      const daysSince = getDaysSinceApplication(brand.application.created_at);
      return daysSince >= 14;
    }).length;

    return {
      needFollowUp,
      pendingCount,
      notAppliedCount,
      waitingLongCount,
    };
  }, [brands, canSendFollowUp, getDaysSinceApplication]);

  return {
    filters,
    setFilters,
    filteredBrands,
    filterSuggestions,
  };
};