-- Create partner_applications table for all seller types
CREATE TABLE public.partner_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  
  -- Common Fields (all seller types)
  partner_type TEXT NOT NULL CHECK (partner_type IN ('brand', 'retailer', 'distributor', 'wholesaler')),
  company_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  ein_number TEXT,
  website_url TEXT,
  
  -- Contact Information
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  contact_name TEXT,
  linkedin TEXT,
  
  -- Address Information
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  
  -- Brand-Specific Fields
  brand_name TEXT,
  product_count TEXT,
  annual_revenue TEXT,
  distribution_channels TEXT[],
  looking_for TEXT[],
  
  -- Distributor/Wholesaler-Specific Fields
  warehouse_locations TEXT[],
  shipping_regions TEXT[],
  min_order_value NUMERIC,
  brands_carried TEXT[],
  certifications TEXT[],
  
  -- Retailer-Specific Fields
  store_count INTEGER,
  marketplace_links JSONB,
  monthly_sales_volume TEXT,
  
  -- Common to multiple types
  product_categories TEXT[],
  
  -- Document & Verification
  document_path TEXT,
  document_verified BOOLEAN DEFAULT FALSE,
  document_verified_at TIMESTAMPTZ,
  document_verified_by UUID REFERENCES public.profiles(id),
  document_verification_notes TEXT,
  
  -- Application Status
  status TEXT DEFAULT 'pending',
  application_status TEXT DEFAULT 'submitted',
  admin_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.partner_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can submit partner applications"
ON public.partner_applications
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own partner applications"
ON public.partner_applications
FOR SELECT
USING (
  (user_id = auth.uid()) OR
  (email = auth.email()) OR
  is_admin()
);

CREATE POLICY "Admins can manage all partner applications"
ON public.partner_applications
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Users can update their own partner applications"
ON public.partner_applications
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create trigger for updated_at
CREATE TRIGGER update_partner_applications_updated_at
BEFORE UPDATE ON public.partner_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();