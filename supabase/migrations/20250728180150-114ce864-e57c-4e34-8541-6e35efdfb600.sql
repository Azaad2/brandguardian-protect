-- Completely reset RLS on reseller_applications
ALTER TABLE public.reseller_applications DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_public_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_view_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_update_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_delete_all" ON public.reseller_applications;

-- Re-enable RLS
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anon role
GRANT ALL ON public.reseller_applications TO anon;
GRANT ALL ON public.reseller_applications TO authenticated;

-- Create simple, working policies
-- Allow anyone (anon/authenticated) to insert
CREATE POLICY "public_can_insert" 
ON public.reseller_applications 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view all
CREATE POLICY "admins_can_view_all" 
ON public.reseller_applications 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update all  
CREATE POLICY "admins_can_update_all" 
ON public.reseller_applications 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete all
CREATE POLICY "admins_can_delete_all" 
ON public.reseller_applications 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);