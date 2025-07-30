-- Re-enable RLS
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies first
DROP POLICY IF EXISTS "allow_anonymous_insert" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_view_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_update" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_delete" ON public.reseller_applications;

-- Create a simple policy that allows everyone to insert
CREATE POLICY "public_can_insert" ON public.reseller_applications
FOR INSERT 
WITH CHECK (true);

-- Allow admins to view all applications
CREATE POLICY "admins_can_view_all" ON public.reseller_applications
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update applications
CREATE POLICY "admins_can_update" ON public.reseller_applications
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete applications
CREATE POLICY "admins_can_delete" ON public.reseller_applications
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);