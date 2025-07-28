-- Drop all existing policies and create a simple one that should definitely work
DROP POLICY IF EXISTS "anon_can_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "authenticated_can_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_delete_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_update_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_view_all" ON public.reseller_applications;

-- Create a single comprehensive policy that allows everything
CREATE POLICY "enable_all_access" 
ON public.reseller_applications 
FOR ALL 
USING (true) 
WITH CHECK (true);