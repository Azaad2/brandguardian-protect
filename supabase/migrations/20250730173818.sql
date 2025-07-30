-- Drop all existing policies on reseller_applications table
DROP POLICY IF EXISTS "public_insert_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_view_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_update_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_delete_applications" ON public.reseller_applications;

-- Enable RLS
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert applications (no authentication required)
CREATE POLICY "allow_anonymous_insert" ON public.reseller_applications
FOR INSERT 
TO anon, authenticated
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