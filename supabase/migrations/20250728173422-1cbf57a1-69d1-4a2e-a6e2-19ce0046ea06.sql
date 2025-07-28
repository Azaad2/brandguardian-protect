-- First, let's check the current policies and fix the RLS for reseller applications
-- We need to ensure anonymous users can actually submit applications

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anonymous can submit applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Admins can update applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON public.reseller_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.reseller_applications;

-- Create a simple policy that allows anyone (including anonymous users) to insert
CREATE POLICY "Allow anonymous application submissions" 
ON public.reseller_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow authenticated users to view their own applications (when user_id matches)
CREATE POLICY "Users can view their applications" 
ON public.reseller_applications 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Allow admins to view all applications
CREATE POLICY "Admins view all applications" 
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
CREATE POLICY "Admins update applications" 
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
CREATE POLICY "Admins delete applications" 
ON public.reseller_applications 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);