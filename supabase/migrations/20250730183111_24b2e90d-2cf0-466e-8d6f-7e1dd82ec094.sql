-- Drop all existing insert policies for reseller_applications
DROP POLICY IF EXISTS "allow_anonymous_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "authenticated_can_insert_own" ON public.reseller_applications;

-- Create a single, simple policy that allows anyone to insert
CREATE POLICY "allow_all_insert" ON public.reseller_applications
FOR INSERT 
WITH CHECK (true);