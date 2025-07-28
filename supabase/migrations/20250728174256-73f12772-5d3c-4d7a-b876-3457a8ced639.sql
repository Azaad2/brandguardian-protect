-- Re-enable RLS and create the simplest possible policy
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies first
DROP POLICY IF EXISTS "anonymous_insert_reseller_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "authenticated_insert_reseller_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "users_select_own_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_select_all_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_update_applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_delete_applications" ON public.reseller_applications;

-- Create the absolute simplest policy for anonymous inserts
CREATE POLICY "allow_all_inserts" 
ON public.reseller_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all
CREATE POLICY "admin_view_all" 
ON public.reseller_applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update
CREATE POLICY "admin_update_all" 
ON public.reseller_applications 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete
CREATE POLICY "admin_delete_all" 
ON public.reseller_applications 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);