-- Re-enable RLS with proper policy for anonymous users
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and create new ones
DROP POLICY IF EXISTS "allow_public_insert" ON public.reseller_applications;

-- Create policy that explicitly allows anonymous role to insert
CREATE POLICY "allow_anon_insert" ON public.reseller_applications
FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policy that allows authenticated users to insert  
CREATE POLICY "allow_auth_insert" ON public.reseller_applications
FOR INSERT 
TO authenticated
WITH CHECK (true);