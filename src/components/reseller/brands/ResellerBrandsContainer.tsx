
import { useBrandApplications } from '@/hooks/use-brand-applications';
import { useOptimizedBrands } from '@/hooks/use-optimized-brands';
import { useBrandFilters } from '@/hooks/use-brand-filters';
import { usePerformanceMonitoring } from '@/hooks/use-performance';
import BrandsHeader from './components/BrandsHeader';
import BrandsFilter from './components/BrandsFilter';
import BrandsLoadingState from './components/BrandsLoadingState';
import BrandsErrorState from './components/BrandsErrorState';
import BrandsEmptyState from './components/BrandsEmptyState';
import QuickFilterButtons from './components/QuickFilterButtons';
import OptimizedBrandList from './components/OptimizedBrandList';
import PerformanceSkeleton from './components/PerformanceSkeleton';
import { MemoizedBrandCard } from './components/MemoizedBrandCard';
import React, { useState, useMemo, useCallback, Suspense } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';

const ResellerBrandsContainer = () => {
  // Enable performance monitoring
  usePerformanceMonitoring();
  
  const { applyToBrand, isApplying } = useBrandApplications();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const brandsPerPage = 50;
  
  // Local filter state for optimized performance
  const [filters, setFilters] = useState({
    searchQuery: '',
    applicationStatus: [],
    followUpActions: [],
    timeFilters: []
  });
  
  // Calculate offset based on current page
  const offset = (currentPage - 1) * brandsPerPage;
  
  // Use optimized brands hook with server-side filtering
  const { 
    brands: optimizedBrands, 
    isLoading, 
    error,
    totalCount,
    prefetchNextPage
  } = useOptimizedBrands(filters, brandsPerPage, offset);
  
  // Use client-side filtering hook for additional filtering logic
  const { filteredBrands, filterSuggestions } = useBrandFilters(optimizedBrands);
  
  // Calculate total pages
  const totalPages = Math.ceil(totalCount / brandsPerPage);
  
  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);
  
  const handleApply = useCallback((brandId: string) => {
    applyToBrand({ brandId });
  }, [applyToBrand]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return <BrandsLoadingState />;
  }

  if (error) {
    return <BrandsErrorState error={error} />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BrandsHeader />
      
      <Suspense fallback={<PerformanceSkeleton />}>
        <QuickFilterButtons 
          filters={filters}
          onFiltersChange={setFilters}
          suggestions={filterSuggestions}
        />
        
        <BrandsFilter 
          filters={filters}
          onFiltersChange={setFilters}
          filteredBrandsCount={filteredBrands.length}
          totalBrandsCount={totalCount}
        />
        
        {filteredBrands.length === 0 ? (
          <BrandsEmptyState searchQuery={filters.searchQuery} filters={filters} />
        ) : (
          <>
            <OptimizedBrandList
              brands={filteredBrands}
              onApply={handleApply}
              isApplying={isApplying}
            />
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                    
                    {/* First page */}
                    {currentPage > 3 && (
                      <>
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(1);
                            }}
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {currentPage > 4 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}
                    
                    {/* Current page and neighbors */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                      const pageNum = pageStart + i;
                      
                      if (pageNum > totalPages) return null;
                      
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            href="#"
                            isActive={pageNum === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {/* Last page */}
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(totalPages);
                            }}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </Suspense>
    </div>
  );
};

export default ResellerBrandsContainer;
