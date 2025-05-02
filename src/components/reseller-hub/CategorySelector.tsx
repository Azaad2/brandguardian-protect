
import React from 'react';
import { CheckCheck } from 'lucide-react';
import { productCategories } from './ResellerFormSchema';
import { ProductCategory } from '@/types/reseller';

interface CategorySelectorProps {
  selectedCategories: ProductCategory[];
  toggleCategory: (category: ProductCategory) => void;
}

const CategorySelector = ({ selectedCategories, toggleCategory }: CategorySelectorProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {productCategories.map((category) => {
        const displayName = category
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return (
          <div 
            key={category}
            className={`
              flex items-center p-3 border rounded-md cursor-pointer
              ${selectedCategories.includes(category) 
                ? 'bg-brandguardian-50 border-brandguardian-300' 
                : 'border-gray-200 hover:bg-gray-50'
              }
            `}
            onClick={() => toggleCategory(category)}
          >
            <div className={`
              flex-shrink-0 h-5 w-5 border rounded-sm mr-2
              ${selectedCategories.includes(category) 
                ? 'bg-brandguardian-600 border-brandguardian-600' 
                : 'border-gray-300'
              }
              flex items-center justify-center
            `}>
              {selectedCategories.includes(category) && (
                <CheckCheck className="h-3 w-3 text-white" />
              )}
            </div>
            <span className="text-sm">{displayName}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategorySelector;
