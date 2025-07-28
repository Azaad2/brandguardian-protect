-- Drop existing policies and recreate them to ensure they work properly
DROP POLICY IF EXISTS "allow_anonymous_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "public_can_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_can_view_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_can_update_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admin_can_delete_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_view_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_update_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_delete_all" ON public.reseller_applications;

-- Create a simple policy that allows anyone to insert (including anonymous users)
CREATE POLICY "public_can_insert" 
ON public.reseller_applications 
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view all applications
CREATE POLICY "admins_can_view_all" 
ON public.reseller_applications 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update applications
CREATE POLICY "admins_can_update_all" 
ON public.reseller_applications 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete applications
CREATE POLICY "admins_can_delete_all" 
ON public.reseller_applications 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);