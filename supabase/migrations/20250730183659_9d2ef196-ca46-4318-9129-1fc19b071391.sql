-- Check and fix RLS policies for reseller_applications
-- First, drop ALL existing policies
DROP POLICY IF EXISTS "enable_insert_for_anon_and_auth" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_delete" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_update" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_view_all" ON public.reseller_applications;

-- Create a simple policy that allows everyone to insert
CREATE POLICY "allow_public_insert" ON public.reseller_applications
FOR INSERT 
WITH CHECK (true);

-- Recreate the admin policies
CREATE POLICY "admins_can_view_all" ON public.reseller_applications
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.user_role = 'admin'
));

CREATE POLICY "admins_can_update" ON public.reseller_applications
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.user_role = 'admin'
));

CREATE POLICY "admins_can_delete" ON public.reseller_applications
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.user_role = 'admin'
));