-- Re-enable RLS on reseller_applications with proper policies
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "admin_view_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_update_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_delete_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "allow_all_inserts" ON public.reseller_applications;

-- Allow anyone to insert reseller applications (for signup)
CREATE POLICY "allow_public_insert" 
ON public.reseller_applications 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view all applications
CREATE POLICY "admin_view_all" 
ON public.reseller_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update all applications
CREATE POLICY "admin_update_all" 
ON public.reseller_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete all applications
CREATE POLICY "admin_delete_all" 
ON public.reseller_applications 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Create function to check for duplicate emails
CREATE OR REPLACE FUNCTION check_duplicate_reseller_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email already exists in reseller_applications
  IF EXISTS (
    SELECT 1 FROM public.reseller_applications 
    WHERE email = NEW.email AND id != COALESCE(NEW.id, gen_random_uuid())
  ) THEN
    RAISE EXCEPTION 'A reseller application with this email already exists';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent duplicate emails
DROP TRIGGER IF EXISTS prevent_duplicate_reseller_email ON public.reseller_applications;
CREATE TRIGGER prevent_duplicate_reseller_email
  BEFORE INSERT OR UPDATE ON public.reseller_applications
  FOR EACH ROW
  EXECUTE FUNCTION check_duplicate_reseller_email();