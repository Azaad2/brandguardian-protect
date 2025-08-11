
export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  user_role: string | null;
  created_at: string;
  updated_at: string;
  bio: string | null;
  status: string | null;
}

export interface ResellerApplication {
  id: string;
  company_name: string;
  business_type: string;
  ein_number: string;
  phone: string;
  sales_volume: string;
  wholesale_budget: string;
  product_categories: string[];
  status: string;
  amazon_seller_id: string | null;
  walmart_seller_id: string | null;
  ebay_seller_id: string | null;
  feedback_score: string | null;
  linkedin: string | null;
}

export interface ConfirmActionState {
  open: boolean;
  title: string;
  description: string;
  confirmText: string;
  action: () => void;
  variant?: 'default' | 'destructive';
}
