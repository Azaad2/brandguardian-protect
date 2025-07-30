-- Re-enable RLS and create proper policies for anonymous users
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "allow_all_insert" ON public.reseller_applications;

-- Create policy that allows both anonymous and authenticated users to insert
CREATE POLICY "enable_insert_for_anon_and_auth" ON public.reseller_applications
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);