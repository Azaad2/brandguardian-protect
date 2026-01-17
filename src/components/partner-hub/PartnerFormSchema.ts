import { z } from 'zod';

export const partnerFormSchema = z.object({
  // Common fields
  partnerType: z.enum(['brand', 'retailer', 'distributor', 'wholesaler']),
  companyName: z.string().min(1, 'Company name is required'),
  businessType: z.enum(['individual', 'corporation', 'partnership', 'llc', 'other']),
  einNumber: z.string().optional().or(z.literal('')),
  websiteUrl: z.string().optional().or(z.literal('')),
  
  // Contact
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  linkedin: z.string().optional().or(z.literal('')),
  
  // Address
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  postalCode: z.string().optional().or(z.literal('')),
  
  // Brand-specific
  brandName: z.string().optional().or(z.literal('')),
  productCount: z.enum(['under_50', '50_200', '200_500', '500_1000', 'over_1000']).optional(),
  annualRevenue: z.enum(['under_100k', '100k_500k', '500k_1m', '1m_5m', '5m_10m', 'over_10m']).optional(),
  distributionChannels: z.array(z.enum(['amazon', 'shopify', 'wholesale', 'retail', 'dtc', 'ebay', 'walmart'])).optional().default([]),
  lookingFor: z.array(z.enum(['resellers', 'distributors', 'retailers', 'wholesalers'])).optional().default([]),
  
  // Distributor/Wholesaler-specific
  warehouseLocations: z.array(z.string()).optional().default([]),
  shippingRegions: z.array(z.enum(['us_nationwide', 'us_east', 'us_west', 'us_midwest', 'us_south', 'international', 'canada', 'mexico'])).optional().default([]),
  minOrderValue: z.string().optional().or(z.literal('')),
  brandsCarried: z.array(z.string()).optional().default([]),
  certifications: z.array(z.enum(['fda', 'usda', 'iso', 'gmp', 'organic', 'kosher', 'halal', 'other'])).optional().default([]),
  
  // Retailer-specific
  storeCount: z.string().optional().or(z.literal('')),
  amazonStoreLink: z.string().optional().or(z.literal('')),
  walmartStoreLink: z.string().optional().or(z.literal('')),
  ebayStoreLink: z.string().optional().or(z.literal('')),
  monthlySalesVolume: z.enum(['under_10k', '10k_50k', '50k_100k', '100k_500k', '500k_1m', 'over_1m']).optional(),
  
  // Common to multiple
  productCategories: z.array(z.enum([
    'electronics', 'beauty', 'home_goods', 'fashion', 'toys',
    'sports', 'automotive', 'health', 'grocery', 'books', 'other'
  ])).min(1, 'Select at least one product category'),
  
  // Terms
  termsAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).superRefine((data, ctx) => {
  // Brand-specific validation
  if (data.partnerType === 'brand') {
    if (!data.brandName || data.brandName.trim() === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Brand name is required',
        path: ['brandName'],
      });
    }
    if (!data.productCount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Product count is required',
        path: ['productCount'],
      });
    }
  }
  
  // Retailer-specific validation
  if (data.partnerType === 'retailer') {
    if (!data.amazonStoreLink && !data.walmartStoreLink && !data.ebayStoreLink) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one marketplace link is required',
        path: ['amazonStoreLink'],
      });
    }
  }
  
  // Distributor/Wholesaler validation
  if (data.partnerType === 'distributor' || data.partnerType === 'wholesaler') {
    if (!data.shippingRegions || data.shippingRegions.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select at least one shipping region',
        path: ['shippingRegions'],
      });
    }
  }
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

export const productCategoryLabels: Record<string, string> = {
  electronics: 'Electronics',
  beauty: 'Beauty & Personal Care',
  home_goods: 'Home & Garden',
  fashion: 'Fashion & Apparel',
  toys: 'Toys & Games',
  sports: 'Sports & Outdoors',
  automotive: 'Automotive',
  health: 'Health & Wellness',
  grocery: 'Grocery & Food',
  books: 'Books & Media',
  other: 'Other',
};

export const distributionChannelLabels: Record<string, string> = {
  amazon: 'Amazon',
  shopify: 'Shopify',
  wholesale: 'Wholesale',
  retail: 'Retail Stores',
  dtc: 'Direct to Consumer',
  ebay: 'eBay',
  walmart: 'Walmart',
};

export const shippingRegionLabels: Record<string, string> = {
  us_nationwide: 'US Nationwide',
  us_east: 'US East Coast',
  us_west: 'US West Coast',
  us_midwest: 'US Midwest',
  us_south: 'US South',
  international: 'International',
  canada: 'Canada',
  mexico: 'Mexico',
};

export const certificationLabels: Record<string, string> = {
  fda: 'FDA Approved',
  usda: 'USDA Certified',
  iso: 'ISO Certified',
  gmp: 'GMP Certified',
  organic: 'Organic Certified',
  kosher: 'Kosher',
  halal: 'Halal',
  other: 'Other',
};
