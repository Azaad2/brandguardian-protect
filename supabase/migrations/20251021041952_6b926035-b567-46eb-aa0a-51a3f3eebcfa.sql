-- Create distributors table
CREATE TABLE public.distributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core identity
    company_name TEXT NOT NULL,
    legal_name TEXT,
    
    -- Contact info
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    website_url TEXT,
    
    -- Location
    country_code TEXT,
    state_province TEXT,
    city TEXT,
    address TEXT,
    postal_code TEXT,
    
    -- Business details
    description TEXT,
    business_type TEXT,
    categories TEXT[],
    brands_carried TEXT[],
    
    -- Verification
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'unverified')),
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES profiles(id),
    
    -- Features for homepage
    featured BOOLEAN DEFAULT false,
    featured_priority INTEGER DEFAULT 0,
    
    -- Media
    logo_url TEXT,
    banner_url TEXT,
    
    -- Engagement metrics
    views_count INTEGER DEFAULT 0,
    contact_requests INTEGER DEFAULT 0,
    
    -- Business metadata
    min_order_value NUMERIC(15,2),
    payment_terms TEXT,
    shipping_regions TEXT[],
    certifications TEXT[],
    
    -- SEO
    slug TEXT UNIQUE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add featured columns to brands_directory
ALTER TABLE brands_directory 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0;

-- Create indexes for distributors
CREATE INDEX idx_distributors_company ON distributors(company_name);
CREATE INDEX idx_distributors_email ON distributors(contact_email);
CREATE INDEX idx_distributors_country ON distributors(country_code);
CREATE INDEX idx_distributors_verification ON distributors(verification_status);
CREATE INDEX idx_distributors_featured ON distributors(featured, featured_priority DESC) WHERE featured = true;
CREATE INDEX idx_distributors_categories ON distributors USING GIN(categories);
CREATE INDEX idx_distributors_brands ON distributors USING GIN(brands_carried);

-- Create index for brands featured
CREATE INDEX IF NOT EXISTS idx_brands_featured ON brands_directory(featured, featured_priority DESC) WHERE featured = true;

-- Enable RLS
ALTER TABLE distributors ENABLE ROW LEVEL SECURITY;

-- RLS Policies for distributors
CREATE POLICY "Public can view verified distributors"
ON distributors FOR SELECT
USING (verification_status = 'verified');

CREATE POLICY "Admins can manage all distributors"
ON distributors FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_distributors_updated_at
BEFORE UPDATE ON distributors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create admin function to add distributors
CREATE OR REPLACE FUNCTION admin_add_distributor(distributor_data JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_distributor_id UUID;
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can add distributors';
  END IF;

  INSERT INTO distributors (
    company_name,
    legal_name,
    contact_email,
    contact_phone,
    website_url,
    country_code,
    state_province,
    city,
    address,
    postal_code,
    description,
    business_type,
    categories,
    brands_carried,
    verification_status,
    featured,
    featured_priority,
    logo_url,
    min_order_value,
    payment_terms,
    shipping_regions,
    certifications
  ) VALUES (
    distributor_data->>'company_name',
    distributor_data->>'legal_name',
    distributor_data->>'contact_email',
    distributor_data->>'contact_phone',
    distributor_data->>'website_url',
    distributor_data->>'country_code',
    distributor_data->>'state_province',
    distributor_data->>'city',
    distributor_data->>'address',
    distributor_data->>'postal_code',
    distributor_data->>'description',
    distributor_data->>'business_type',
    CASE 
      WHEN distributor_data->'categories' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'categories'))
      ELSE NULL
    END,
    CASE 
      WHEN distributor_data->'brands_carried' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'brands_carried'))
      ELSE NULL
    END,
    COALESCE(distributor_data->>'verification_status', 'pending'),
    COALESCE((distributor_data->>'featured')::boolean, false),
    COALESCE((distributor_data->>'featured_priority')::integer, 0),
    distributor_data->>'logo_url',
    CASE 
      WHEN distributor_data->>'min_order_value' IS NOT NULL 
      THEN (distributor_data->>'min_order_value')::numeric
      ELSE NULL
    END,
    distributor_data->>'payment_terms',
    CASE 
      WHEN distributor_data->'shipping_regions' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'shipping_regions'))
      ELSE NULL
    END,
    CASE 
      WHEN distributor_data->'certifications' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'certifications'))
      ELSE NULL
    END
  ) RETURNING id INTO new_distributor_id;
  
  RETURN new_distributor_id;
END;
$$;

-- Create admin function to update distributors
CREATE OR REPLACE FUNCTION admin_update_distributor(distributor_id UUID, distributor_data JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can update distributors';
  END IF;

  UPDATE distributors 
  SET 
    company_name = COALESCE(distributor_data->>'company_name', company_name),
    legal_name = COALESCE(distributor_data->>'legal_name', legal_name),
    contact_email = COALESCE(distributor_data->>'contact_email', contact_email),
    contact_phone = COALESCE(distributor_data->>'contact_phone', contact_phone),
    website_url = COALESCE(distributor_data->>'website_url', website_url),
    country_code = COALESCE(distributor_data->>'country_code', country_code),
    state_province = COALESCE(distributor_data->>'state_province', state_province),
    city = COALESCE(distributor_data->>'city', city),
    address = COALESCE(distributor_data->>'address', address),
    postal_code = COALESCE(distributor_data->>'postal_code', postal_code),
    description = COALESCE(distributor_data->>'description', description),
    business_type = COALESCE(distributor_data->>'business_type', business_type),
    categories = CASE 
      WHEN distributor_data->'categories' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'categories'))
      ELSE categories
    END,
    brands_carried = CASE 
      WHEN distributor_data->'brands_carried' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'brands_carried'))
      ELSE brands_carried
    END,
    verification_status = COALESCE(distributor_data->>'verification_status', verification_status),
    featured = COALESCE((distributor_data->>'featured')::boolean, featured),
    featured_priority = COALESCE((distributor_data->>'featured_priority')::integer, featured_priority),
    logo_url = COALESCE(distributor_data->>'logo_url', logo_url),
    min_order_value = CASE 
      WHEN distributor_data->>'min_order_value' IS NOT NULL 
      THEN (distributor_data->>'min_order_value')::numeric
      ELSE min_order_value
    END,
    payment_terms = COALESCE(distributor_data->>'payment_terms', payment_terms),
    shipping_regions = CASE 
      WHEN distributor_data->'shipping_regions' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'shipping_regions'))
      ELSE shipping_regions
    END,
    certifications = CASE 
      WHEN distributor_data->'certifications' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(distributor_data->'certifications'))
      ELSE certifications
    END,
    updated_at = NOW()
  WHERE id = distributor_id;
  
  RETURN FOUND;
END;
$$;

-- Create admin function to delete distributors
CREATE OR REPLACE FUNCTION admin_delete_distributor(distributor_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can delete distributors';
  END IF;

  DELETE FROM distributors WHERE id = distributor_id;
  
  RETURN FOUND;
END;
$$;