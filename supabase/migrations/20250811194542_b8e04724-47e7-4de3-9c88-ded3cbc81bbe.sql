-- CRITICAL SECURITY FIX: Strengthen RLS policies for reseller_applications
-- This fixes the vulnerability where sensitive business data could be accessed inappropriately

-- 1. Drop all existing policies to rebuild them securely
DROP POLICY IF EXISTS "Admins can manage all reseller applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Authenticated users can create reseller applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Users can view their own reseller applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Users can update their own reseller applications" ON public.reseller_applications;

-- 2. Create a more secure admin-only SELECT policy
CREATE POLICY "Admins can view all reseller applications" 
  ON public.reseller_applications 
  FOR SELECT 
  USING (
    -- Only admins can view reseller applications
    public.is_admin()
  );

-- 3. Secure INSERT policy - allow public applications but with strict validation
CREATE POLICY "Public can create reseller applications" 
  ON public.reseller_applications 
  FOR INSERT 
  WITH CHECK (
    -- For authenticated users: must set their own user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR 
    -- For anonymous applications: user_id must be null
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- 4. Secure UPDATE policy - only admins can update applications
CREATE POLICY "Admins can update reseller applications" 
  ON public.reseller_applications 
  FOR UPDATE 
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Secure DELETE policy - only admins can delete applications
CREATE POLICY "Admins can delete reseller applications" 
  ON public.reseller_applications 
  FOR DELETE 
  USING (public.is_admin());

-- 6. Add data integrity constraints to prevent data manipulation
ALTER TABLE public.reseller_applications 
DROP CONSTRAINT IF EXISTS check_email_format;

ALTER TABLE public.reseller_applications 
ADD CONSTRAINT check_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 7. Add constraint to prevent empty sensitive fields
ALTER TABLE public.reseller_applications 
DROP CONSTRAINT IF EXISTS check_required_fields;

ALTER TABLE public.reseller_applications 
ADD CONSTRAINT check_required_fields 
CHECK (
  length(trim(company_name)) > 0 AND
  length(trim(ein_number)) > 0 AND
  length(trim(email)) > 0 AND
  length(trim(phone)) > 0
);

-- 8. Create audit trigger for monitoring access (optional but recommended)
CREATE OR REPLACE FUNCTION public.audit_reseller_application_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Log access attempts (you can extend this to write to an audit table)
  RAISE LOG 'Reseller application accessed: % by user: %', 
    COALESCE(NEW.id, OLD.id), 
    COALESCE(auth.uid(), 'anonymous');
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger
DROP TRIGGER IF EXISTS audit_reseller_applications ON public.reseller_applications;
CREATE TRIGGER audit_reseller_applications
  AFTER INSERT OR UPDATE OR DELETE ON public.reseller_applications
  FOR EACH ROW EXECUTE FUNCTION public.audit_reseller_application_access();