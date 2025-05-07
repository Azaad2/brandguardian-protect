
export type BusinessType = 'individual' | 'corporation' | 'partnership' | 'llc' | 'other';

export type ProductCategory = 
  'electronics' | 'beauty' | 'home_goods' | 'fashion' | 'toys' |
  'sports' | 'automotive' | 'health' | 'grocery' | 'books' | 'other';

export type SalesVolume = 
  'under_10k' | '10k_50k' | '50k_100k' | '100k_500k' | '500k_1m' | 'over_1m';

export type WholesaleBudget = 
  'under_5k' | '5k_10k' | '10k_25k' | '25k_50k' | '50k_100k' | '100k_500k' | 'over_100k';

export interface ResellerFormData {
  companyName: string;
  businessType: BusinessType;
  einNumber: string;
  amazonSellerId?: string;
  walmartSellerId?: string;
  ebaySellerId?: string;
  productCategories: ProductCategory[];
  salesVolume: SalesVolume;
  wholesaleBudget: WholesaleBudget;
  feedbackScore?: string;
  email: string;
  phone: string;
  linkedIn?: string;
  termsAgreement: boolean;
}
