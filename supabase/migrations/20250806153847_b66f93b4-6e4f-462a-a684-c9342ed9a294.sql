-- Add RLS policies for reseller_applications table since it has RLS enabled but no policies
-- Enable admins to manage all reseller applications
CREATE POLICY "Admins can manage all reseller applications" 
ON public.reseller_applications 
FOR ALL 
USING (is_admin());

-- Allow public access for reseller application creation (signup process)
CREATE POLICY "Allow public reseller application creation" 
ON public.reseller_applications 
FOR INSERT 
WITH CHECK (true);

-- Allow users to view their own applications if they have user_id set
CREATE POLICY "Users can view their own reseller applications" 
ON public.reseller_applications 
FOR SELECT 
USING (auth.uid() = user_id);