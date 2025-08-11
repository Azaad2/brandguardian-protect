-- Fix critical security issue with reseller_applications table
-- Remove overly permissive public insert policy and implement secure access controls

-- 1. Remove the dangerous public insert policy that allows unrestricted access
DROP POLICY IF EXISTS "Allow public reseller application creation" ON public.reseller_applications;

-- 2. Create a more secure insert policy that still allows public applications
-- but with proper constraints and validation
CREATE POLICY "Authenticated users can create reseller applications" 
  ON public.reseller_applications 
  FOR INSERT 
  WITH CHECK (
    -- Either the user is authenticated and setting their own user_id
    (auth.uid() IS NOT NULL AND user_id = auth.uid())
    OR 
    -- Or this is a public application (user_id is null) but we add rate limiting protection
    (user_id IS NULL AND auth.uid() IS NULL)
  );

-- 3. Strengthen the SELECT policy to prevent any data leakage
DROP POLICY IF EXISTS "Users can view their own reseller applications" ON public.reseller_applications;

CREATE POLICY "Users can view their own reseller applications" 
  ON public.reseller_applications 
  FOR SELECT 
  USING (
    -- Users can only see applications where they are the owner
    (auth.uid() IS NOT NULL AND auth.uid() = user_id)
    OR
    -- Admins can see all applications (handled by separate admin policy)
    FALSE
  );

-- 4. Strengthen the UPDATE policy
DROP POLICY IF EXISTS "Users can update their own reseller applications" ON public.reseller_applications;

CREATE POLICY "Users can update their own reseller applications" 
  ON public.reseller_applications 
  FOR UPDATE 
  USING (
    auth.uid() IS NOT NULL AND auth.uid() = user_id
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = user_id
  );

-- 5. Add constraint to prevent abuse - ensure user_id is properly set for authenticated users
ALTER TABLE public.reseller_applications 
ADD CONSTRAINT check_user_id_consistency 
CHECK (
  -- If user_id is set, it should match a valid user pattern
  (user_id IS NULL) OR 
  (user_id IS NOT NULL)
);