-- Fix RLS policy for reseller_applications to allow anonymous users to insert
DROP POLICY IF EXISTS "public_can_insert" ON public.reseller_applications;

-- Create a new policy that allows anonymous users to insert
CREATE POLICY "allow_anonymous_insert" ON public.reseller_applications
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Also ensure authenticated users can insert their own applications
CREATE POLICY "authenticated_can_insert_own" ON public.reseller_applications
FOR INSERT 
TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());