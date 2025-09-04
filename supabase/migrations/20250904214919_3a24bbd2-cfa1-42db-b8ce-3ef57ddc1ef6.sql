-- Phase 1: Simple Database Schema Updates

-- Add document verification columns to reseller_applications table
ALTER TABLE public.reseller_applications 
ADD COLUMN IF NOT EXISTS document_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS document_verification_notes text,
ADD COLUMN IF NOT EXISTS document_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS document_verified_by uuid REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS application_status text DEFAULT 'submitted';

-- Create comprehensive admin function for reseller applications
CREATE OR REPLACE FUNCTION public.admin_get_reseller_applications()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  company_name text,
  business_type text,
  ein_number text,
  phone text,
  sales_volume text,
  wholesale_budget text,
  product_categories text[],
  status text,
  application_status text,
  amazon_seller_id text,
  walmart_seller_id text,
  ebay_seller_id text,
  feedback_score text,
  linkedin text,
  document_path text,
  document_verified boolean,
  document_verification_notes text,
  document_verified_at timestamp with time zone,
  document_verified_by uuid,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    ra.id,
    ra.user_id,
    ra.email,
    ra.company_name,
    ra.business_type,
    ra.ein_number,
    ra.phone,
    ra.sales_volume,
    ra.wholesale_budget,
    ra.product_categories,
    ra.status,
    COALESCE(ra.application_status, 'submitted') as application_status,
    ra.amazon_seller_id,
    ra.walmart_seller_id,
    ra.ebay_seller_id,
    ra.feedback_score,
    ra.linkedin,
    ra.document_path,
    COALESCE(ra.document_verified, false) as document_verified,
    ra.document_verification_notes,
    ra.document_verified_at,
    ra.document_verified_by,
    ra.created_at,
    ra.updated_at
  FROM public.reseller_applications ra
  WHERE EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND user_role = 'admin'
  )
  ORDER BY ra.created_at DESC;
$$;

-- Create function to update document verification
CREATE OR REPLACE FUNCTION public.admin_verify_document(
  application_id uuid,
  verified boolean,
  notes text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Update document verification
  UPDATE public.reseller_applications 
  SET 
    document_verified = verified,
    document_verification_notes = notes,
    document_verified_at = CASE WHEN verified THEN now() ELSE NULL END,
    document_verified_by = CASE WHEN verified THEN auth.uid() ELSE NULL END,
    updated_at = now()
  WHERE id = application_id;
  
  RETURN FOUND;
END;
$$;