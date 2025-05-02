
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CategorySelector from './CategorySelector';
import { ProductCategory } from '@/types/reseller';
import { FormValues } from './ResellerFormSchema';

interface ProductCategoriesSectionProps {
  selectedCategories: ProductCategory[];
  toggleCategory: (category: ProductCategory) => void;
}

const ProductCategoriesSection = ({ 
  selectedCategories, 
  toggleCategory 
}: ProductCategoriesSectionProps) => {
  const form = useFormContext<FormValues>();
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="productCategories"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-lg font-semibold text-gray-900">
                Product Categories
              </FormLabel>
              <p className="text-sm text-gray-500">
                Select the categories you specialize in
              </p>
            </div>
            <CategorySelector 
              selectedCategories={selectedCategories} 
              toggleCategory={toggleCategory} 
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProductCategoriesSection;
