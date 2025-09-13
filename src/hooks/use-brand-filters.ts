import { useState, useMemo } from 'react';
import { OptimizedBrand } from './use-optimized-brands';
// Remove follow-up hook import since we're using direct logic

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

export const useBrandFilters = (brands: OptimizedBrand[] = []) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    applicationStatus: [],
    followUpActions: [],
    timeFilters: [],
  });

  // Remove follow-up hook usage since we're using direct logic

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
        const hasApplication = brand.application_status !== null;
        const currentStatus = brand.application_status || 'not_applied';
        
        const statusMatch = filters.applicationStatus.some(filterStatus => {
          if (filterStatus === 'not_applied' && !hasApplication) return true;
          if (filterStatus === currentStatus) return true;
          return false;
        });
        
        if (!statusMatch) return false;
      }

      // Follow-up Action filters
      if (filters.followUpActions.length > 0) {
        if (!brand.application_status || brand.application_status !== 'pending') {
          // If filtering for follow-up actions but no pending application, exclude
          return false;
        }

        const followUpMatch = filters.followUpActions.some(filterAction => {
          switch (filterAction) {
            case 'need_followup':
              return brand.follow_up_count < 3 && 
                (!brand.last_follow_up_at || 
                  new Date(brand.last_follow_up_at) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));
            case 'followup_sent':
              return brand.follow_up_count > 0;
            case 'max_followups':
              return brand.follow_up_count >= 3;
            default:
              return false;
          }
        });
        
        if (!followUpMatch) return false;
      }

      // Time-based filters
      if (filters.timeFilters.length > 0) {
        if (!brand.application_created_at) {
          // If filtering by time but no application, exclude
          return false;
        }

        const daysSinceApplication = Math.floor((Date.now() - new Date(brand.application_created_at).getTime()) / (1000 * 60 * 60 * 24));
        const daysSinceLastActivity = brand.last_follow_up_at ? 
          Math.floor((Date.now() - new Date(brand.last_follow_up_at).getTime()) / (1000 * 60 * 60 * 24)) :
          daysSinceApplication;

        const timeMatch = filters.timeFilters.some(timeFilter => {
          switch (timeFilter) {
            case 'recently_applied':
              return daysSinceApplication <= 7;
            case 'waiting_long':
              return daysSinceApplication >= 14;
            case 'response_expected':
              return brand.response_expected_by && 
                new Date(brand.response_expected_by) < new Date() &&
                brand.application_status === 'pending';
            default:
              return false;
          }
        });
        
        if (!timeMatch) return false;
      }

      return true;
    });
  }, [brands, filters]);

  // Calculate filter suggestions based on current data
  const filterSuggestions = useMemo(() => {
    const needFollowUp = brands.filter(brand => 
      brand.application_status === 'pending' && 
      brand.follow_up_count < 3 &&
      (!brand.last_follow_up_at || 
        new Date(brand.last_follow_up_at) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
    ).length;

    const pendingCount = brands.filter(brand => 
      brand.application_status === 'pending'
    ).length;

    const notAppliedCount = brands.filter(brand => 
      !brand.application_status
    ).length;

    const waitingLongCount = brands.filter(brand => {
      if (!brand.application_created_at) return false;
      const daysSince = Math.floor((Date.now() - new Date(brand.application_created_at).getTime()) / (1000 * 60 * 60 * 24));
      return daysSince >= 14;
    }).length;

    return {
      needFollowUp: needFollowUp,
      pendingCount: pendingCount,
      notAppliedCount: notAppliedCount,
      waitingLongCount: waitingLongCount,
    };
  }, [brands]);

  return {
    filters,
    setFilters,
    filteredBrands,
    filterSuggestions,
  };
};