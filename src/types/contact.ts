
export interface ContactSubmission {
  id: string;
  createdAt: string;
  timestamp?: string; // Added for Admin.tsx compatibility
  name: string;
  company: string;
  companyName?: string; // Added for Admin.tsx compatibility
  email: string;
  marketplaces: string;
  amazonLink?: string;
  message?: string;
  contactPerson?: string; // Added for Admin.tsx compatibility
  phone?: string; // Added for Admin.tsx compatibility
  primaryConcern?: string; // Added for Admin.tsx compatibility
  productCount?: string; // Added for Admin.tsx compatibility
}
