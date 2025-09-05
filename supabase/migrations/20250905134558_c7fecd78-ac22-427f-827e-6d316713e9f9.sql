-- Fix RLS policy for reseller_applications to allow admins to insert applications
DROP POLICY IF EXISTS "Public can create reseller applications" ON public.reseller_applications;

CREATE POLICY "Admins and users can create reseller applications" 
ON public.reseller_applications 
FOR INSERT 
WITH CHECK (
  -- Allow admins to insert any application
  is_admin() OR 
  -- Allow authenticated users to insert their own applications
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR 
  -- Allow unauthenticated users to insert applications without user_id
  (auth.uid() IS NULL AND user_id IS NULL)
);

-- Add foreign key relationship between product_uploads.brand_id and profiles.id
ALTER TABLE public.product_uploads 
ADD CONSTRAINT fk_product_uploads_brand_profile 
FOREIGN KEY (brand_id) REFERENCES public.profiles(id) ON DELETE CASCADE;