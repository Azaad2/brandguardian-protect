-- Fix the insert policy to properly allow anonymous users
DROP POLICY IF EXISTS "allow_public_insert" ON public.reseller_applications;

-- Create a policy that explicitly allows both anonymous and authenticated users to insert
CREATE POLICY "allow_public_insert" 
ON public.reseller_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also ensure the table is properly configured for public access
GRANT INSERT ON public.reseller_applications TO anon;
GRANT SELECT ON public.reseller_applications TO anon;