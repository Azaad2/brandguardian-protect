export type PartnerType = 'brand' | 'retailer' | 'distributor' | 'wholesaler';

export type BusinessType = 'individual' | 'corporation' | 'partnership' | 'llc' | 'other';

export type ProductCount = 'under_50' | '50_200' | '200_500' | '500_1000' | 'over_1000';

export type AnnualRevenue = 'under_100k' | '100k_500k' | '500k_1m' | '1m_5m' | '5m_10m' | 'over_10m';

export type MonthlySalesVolume = 'under_10k' | '10k_50k' | '50k_100k' | '100k_500k' | '500k_1m' | 'over_1m';

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

export type DistributionChannel = 'amazon' | 'shopify' | 'wholesale' | 'retail' | 'dtc' | 'ebay' | 'walmart';

export type LookingFor = 'resellers' | 'distributors' | 'retailers' | 'wholesalers';

export type ShippingRegion = 'us_nationwide' | 'us_east' | 'us_west' | 'us_midwest' | 'us_south' | 'international' | 'canada' | 'mexico';

export type Certification = 'fda' | 'usda' | 'iso' | 'gmp' | 'organic' | 'kosher' | 'halal' | 'other';

export interface PartnerFormData {
  // Common fields
  partnerType: PartnerType;
  companyName: string;
  businessType: BusinessType;
  einNumber: string;
  websiteUrl: string;
  
  // Contact
  email: string;
  phone: string;
  contactName: string;
  linkedin: string;
  
  // Address
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  
  // Brand-specific
  brandName: string;
  productCount: ProductCount;
  annualRevenue: AnnualRevenue;
  distributionChannels: DistributionChannel[];
  lookingFor: LookingFor[];
  
  // Distributor/Wholesaler-specific
  warehouseLocations: string[];
  shippingRegions: ShippingRegion[];
  minOrderValue: string;
  brandsCarried: string[];
  certifications: Certification[];
  
  // Retailer-specific
  storeCount: string;
  amazonStoreLink: string;
  walmartStoreLink: string;
  ebayStoreLink: string;
  monthlySalesVolume: MonthlySalesVolume;
  
  // Common to multiple
  productCategories: ProductCategory[];
  
  // Terms
  termsAgreement: boolean;
}

export interface PartnerTypeOption {
  type: PartnerType;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}
