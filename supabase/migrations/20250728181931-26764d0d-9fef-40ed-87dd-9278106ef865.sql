-- Re-enable RLS and create working policies
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert applications
CREATE POLICY "allow_public_insert" 
ON public.reseller_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all applications
CREATE POLICY "admins_view_all" 
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
CREATE POLICY "admins_update_all" 
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
CREATE POLICY "admins_delete_all" 
ON public.reseller_applications 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);