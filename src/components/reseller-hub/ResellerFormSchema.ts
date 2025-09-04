
import { z } from 'zod';
import { BusinessType, ProductCategory, SalesVolume, WholesaleBudget } from '@/types/reseller';

export const formSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  businessType: z.enum(['individual', 'corporation', 'partnership', 'llc', 'other'] as const),
  einNumber: z.string().min(1, 'EIN number is required'),
  amazonStoreLink: z.string().min(1, 'Amazon store link is required').url('Please enter a valid Amazon store URL'),
  walmartStoreLink: z.string().optional().or(z.literal('')),
  ebayStoreLink: z.string().optional().or(z.literal('')),
  productCategories: z.array(
    z.enum([
      'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
      'sports', 'automotive', 'health', 'grocery', 'books', 'other'
    ] as const)
  ).min(1, 'Please select at least one product category').default(['other']),
  salesVolume: z.enum([
    'under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'over_1m'
  ] as const),
  wholesaleBudget: z.enum([
    'under_5k', '5k_10k', '10k_25k', '25k_50k', '50k_100k', 'over_100k'
  ] as const),
  feedbackScore: z.string().optional().or(z.literal('')),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  linkedIn: z.string().optional().or(z.literal('')),
  termsAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  // Document upload is now optional - applications can be submitted without documents
  documentRequired: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

export const productCategories: ProductCategory[] = [
  'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
  'sports', 'automotive', 'health', 'grocery', 'books', 'other'
];
