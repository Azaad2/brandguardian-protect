-- Drop and recreate the insert policy with explicit role targeting
DROP POLICY IF EXISTS "allow_public_insert" ON public.reseller_applications;

-- Create separate policies for anonymous and authenticated users
CREATE POLICY "anon_can_insert" 
ON public.reseller_applications 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "authenticated_can_insert" 
ON public.reseller_applications 
FOR INSERT 
TO authenticated
WITH CHECK (true);