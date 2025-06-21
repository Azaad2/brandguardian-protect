
export interface Brand {
  id: string;
  name: string;
  website_url: string | null;
  description: string | null;
  contact_email: string;
  logo_url: string | null;
  categories: string[] | null;
  is_active: boolean;
  approval_rate: number | null;
  response_time: number | null;
  created_at: string;
  updated_at: string;
}

export interface BrandFormData {
  name: string;
  website_url: string;
  description: string;
  contact_email: string;
  logo_url: string;
  categories: string;
  approval_rate: string;
  response_time: string;
}
