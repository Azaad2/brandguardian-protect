-- Add UPDATE policy for reseller applications
CREATE POLICY "Users can update their own reseller applications" 
  ON public.reseller_applications 
  FOR UPDATE 
  USING (auth.uid() = user_id);