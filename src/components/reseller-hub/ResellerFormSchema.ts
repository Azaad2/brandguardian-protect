
import { z } from 'zod';
import { BusinessType, ProductCategory, SalesVolume, WholesaleBudget } from '@/types/reseller';

export const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  businessType: z.enum(['individual', 'corporation', 'partnership', 'llc', 'other'] as const),
  einNumber: z.string().min(1, 'EIN number is required'),
  amazonSellerId: z.string().optional(),
  walmartSellerId: z.string().optional(),
  ebaySellerId: z.string().optional(),
  productCategories: z.array(
    z.enum([
      'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
      'sports', 'automotive', 'health', 'grocery', 'books', 'other'
    ] as const)
  ).default(['other']), // Changed to default instead of requiring selection
  salesVolume: z.enum([
    'under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'over_1m'
  ] as const),
  wholesaleBudget: z.enum([
    'under_5k', '5k_10k', '10k_25k', '25k_50k', '50k_100k', 'over_100k'
  ] as const),
  feedbackScore: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  linkedIn: z.string().optional(),
  termsAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export const productCategories: ProductCategory[] = [
  'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
  'sports', 'automotive', 'health', 'grocery', 'books', 'other'
];
