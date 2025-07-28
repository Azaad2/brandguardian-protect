-- Re-enable RLS with proper policies that work
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;

-- Allow anyone (including anonymous users) to insert new applications
CREATE POLICY "allow_anonymous_insert" 
ON public.reseller_applications 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all applications
CREATE POLICY "admin_can_view_all" 
ON public.reseller_applications 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to update applications
CREATE POLICY "admin_can_update_all" 
ON public.reseller_applications 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Allow admins to delete applications
CREATE POLICY "admin_can_delete_all" 
ON public.reseller_applications 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);