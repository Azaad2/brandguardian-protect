-- Let's check the current state and fix the RLS policies completely
-- First, let's see what policies exist currently
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'reseller_applications';

-- Drop all existing policies to ensure clean slate
DROP POLICY IF EXISTS "Allow anonymous application submissions" ON public.reseller_applications;
DROP POLICY IF EXISTS "Users can view their applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Admins view all applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Admins update applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Admins delete applications" ON public.reseller_applications;

-- Disable RLS temporarily to test
ALTER TABLE public.reseller_applications DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Create the most permissive policy for anonymous submissions
CREATE POLICY "anonymous_insert_reseller_applications" 
ON public.reseller_applications 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert as well
CREATE POLICY "authenticated_insert_reseller_applications" 
ON public.reseller_applications 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow users to view their own applications (when they have user_id)
CREATE POLICY "users_select_own_applications" 
ON public.reseller_applications 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Allow admins to view all applications
CREATE POLICY "admins_select_all_applications" 
ON public.reseller_applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update applications
CREATE POLICY "admins_update_applications" 
ON public.reseller_applications 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete applications
CREATE POLICY "admins_delete_applications" 
ON public.reseller_applications 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);