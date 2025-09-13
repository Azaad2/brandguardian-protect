import React from 'react';
import { OptimizedBrand } from '@/hooks/use-optimized-brands';
import { MemoizedBrandCard } from './MemoizedBrandCard';

interface OptimizedBrandListProps {
  brands: OptimizedBrand[];
  onApply: (brandId: string) => void;
  isApplying: boolean;
}

const OptimizedBrandList: React.FC<OptimizedBrandListProps> = ({
  brands,
  onApply,
  isApplying,
}) => {
  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {brands.map((brand) => (
        <MemoizedBrandCard 
          key={brand.id} 
          brand={brand}
          onApply={onApply}
          isApplying={isApplying}
          canApply={true}
        />
      ))}
    </div>
  );
};

export default React.memo(OptimizedBrandList);