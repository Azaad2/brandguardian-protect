
export type BusinessType = 'individual' | 'corporation' | 'partnership' | 'llc' | 'other';

export type ProductCategory = 
  | 'electronics'
  | 'beauty'
  | 'home_goods'
  | 'fashion'
  | 'toys'
  | 'sports'
  | 'automotive'
  | 'health'
  | 'grocery'
  | 'books'
  | 'other';

export type SalesVolume = 
  | 'under_10k'
  | '10k_50k'
  | '50k_100k'
  | '100k_500k'
  | '500k_1m'
  | 'over_1m';

export type WholesaleBudget =
  | 'under_5k'
  | '5k_10k'
  | '10k_25k'
  | '25k_50k'
  | '50k_100k'
  | 'over_100k';

export type ResellerFormData = {
  // Business Information
  companyName: string;
  businessType: BusinessType;
  businessLicense: string;
  taxId: string;
  
  // Marketplace Profiles
  amazonSellerId?: string;
  walmartSellerId?: string;
  ebaySellerId?: string;
  
  // Product Categories
  productCategories: ProductCategory[];
  
  // Sales Performance
  salesVolume: SalesVolume;
  feedbackScore?: string;
  
  // Purchasing Information
  wholesaleBudget: WholesaleBudget;
  
  // Contact Information
  email: string;
  phone: string;
  linkedIn?: string;
  
  // Agreement
  termsAgreement: boolean;
};
