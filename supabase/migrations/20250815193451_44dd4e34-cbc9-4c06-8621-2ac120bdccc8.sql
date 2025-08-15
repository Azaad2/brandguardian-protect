-- Add missing RLS policy for resellers to view their own applications
CREATE POLICY "Users can view their own reseller applications" 
ON public.reseller_applications 
FOR SELECT 
USING (user_id = auth.uid());

-- Add RLS policy for resellers to update their own applications
CREATE POLICY "Users can update their own reseller applications" 
ON public.reseller_applications 
FOR UPDATE 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());