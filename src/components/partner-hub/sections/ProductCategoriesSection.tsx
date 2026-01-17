import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react';
import { PartnerFormValues, productCategoryLabels } from '../PartnerFormSchema';

interface ProductCategoriesSectionProps {
  form: UseFormReturn<PartnerFormValues>;
}

export function ProductCategoriesSection({ form }: ProductCategoriesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5 text-primary" />
          Product Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="productCategories"
          render={() => (
            <FormItem>
              <FormLabel>Select Product Categories *</FormLabel>
              <FormDescription>Choose all categories that apply to your business</FormDescription>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {Object.entries(productCategoryLabels).map(([value, label]) => (
                  <FormField
                    key={value}
                    control={form.control}
                    name="productCategories"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(value as any)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, value]);
                              } else {
                                field.onChange(current.filter((v) => v !== value));
                              }
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          {label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
