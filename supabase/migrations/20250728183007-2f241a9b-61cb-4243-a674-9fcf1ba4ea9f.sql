-- Drop the overly permissive policy and create secure ones
DROP POLICY IF EXISTS "enable_all_access" ON public.reseller_applications;

-- Allow public to insert applications
CREATE POLICY "public_insert_applications" 
ON public.reseller_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all applications  
CREATE POLICY "admins_view_applications" 
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