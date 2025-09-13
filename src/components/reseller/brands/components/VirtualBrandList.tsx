import React, { useMemo, useCallback } from 'react';
import { List } from 'react-window';
import { OptimizedBrand } from '@/hooks/use-optimized-brands';
import { MemoizedBrandCard } from './MemoizedBrandCard';

interface VirtualBrandListProps {
  brands: OptimizedBrand[];
  onApply: (brandId: string) => void;
  isApplying: boolean;
  height?: number;
  itemHeight?: number;
}

const VirtualBrandList: React.FC<VirtualBrandListProps> = ({
  brands,
  onApply,
  isApplying,
  height = 600,
  itemHeight = 320, // Height of each brand card
}) => {
  // Calculate grid dimensions for responsive layout
  const getItemsPerRow = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1280) return 3; // xl
    if (width >= 768) return 2;  // md
    return 1; // sm
  }, []);

  const itemsPerRow = useMemo(() => getItemsPerRow(), [getItemsPerRow]);
  const rowCount = Math.ceil(brands.length / itemsPerRow);

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const startIndex = index * itemsPerRow;
    const endIndex = Math.min(startIndex + itemsPerRow, brands.length);
    const rowBrands = brands.slice(startIndex, endIndex);

    return (
      <div style={style} className="flex gap-6 px-6">
        {rowBrands.map((brand, i) => (
          <div key={brand.id} className={`${itemsPerRow === 1 ? 'w-full' : itemsPerRow === 2 ? 'w-1/2' : 'w-1/3'}`}>
            <MemoizedBrandCard
              brand={brand}
              onApply={onApply}
              isApplying={isApplying}
              canApply={true}
            />
          </div>
        ))}
        {/* Fill remaining space if row is not complete */}
        {Array.from({ length: itemsPerRow - rowBrands.length }).map((_, i) => (
          <div key={`empty-${i}`} className={`${itemsPerRow === 1 ? 'w-full' : itemsPerRow === 2 ? 'w-1/2' : 'w-1/3'}`} />
        ))}
      </div>
    );
  }, [brands, itemsPerRow, onApply, isApplying]);

  if (brands.length === 0) {
    return null;
  }

  return (
    <div className="virtual-list-container">
      <List
        height={height}
        itemCount={rowCount}
        itemSize={itemHeight}
        width="100%"
        itemData={brands}
      >
        {Row}
      </List>
    </div>
  );
};

export default React.memo(VirtualBrandList);