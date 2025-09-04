-- Phase 1: Fix Database Schema & Add Document Verification (Fixed)

-- Temporarily disable the duplicate email trigger
ALTER TABLE public.reseller_applications DISABLE TRIGGER check_duplicate_reseller_email_trigger;

-- Add document verification columns to reseller_applications table
ALTER TABLE public.reseller_applications 
ADD COLUMN IF NOT EXISTS document_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS document_verification_notes text,
ADD COLUMN IF NOT EXISTS document_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS document_verified_by uuid REFERENCES public.profiles(id);

-- Add comprehensive application status tracking
ALTER TABLE public.reseller_applications 
ADD COLUMN IF NOT EXISTS application_status text DEFAULT 'submitted';

-- Add check constraint for application_status
ALTER TABLE public.reseller_applications 
ADD CONSTRAINT check_application_status 
CHECK (application_status IN ('submitted', 'document_pending', 'document_review', 'pending', 'approved', 'rejected'));

-- Update existing applications to have proper status based on current status
UPDATE public.reseller_applications 
SET application_status = CASE 
  WHEN status = 'pending' AND document_path IS NOT NULL THEN 'pending'
  WHEN status = 'pending' AND document_path IS NULL THEN 'document_pending'
  WHEN status = 'approved' THEN 'approved'
  WHEN status = 'rejected' THEN 'rejected'
  ELSE 'submitted'
END;

-- Re-enable the duplicate email trigger
ALTER TABLE public.reseller_applications ENABLE TRIGGER check_duplicate_reseller_email_trigger;

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
    application_status = CASE 
      WHEN verified AND status = 'pending' THEN 'pending'
      WHEN verified THEN 'document_review'
      ELSE 'document_pending'
    END,
    updated_at = now()
  WHERE id = application_id;
  
  RETURN FOUND;
END;
$$;