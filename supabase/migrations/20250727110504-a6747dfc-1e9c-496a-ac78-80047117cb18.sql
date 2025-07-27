-- Clean up conflicting RLS policies for reseller_applications

-- Drop duplicate policies
DROP POLICY IF EXISTS "Allow anyone to insert" ON reseller_applications;
DROP POLICY IF EXISTS "Anonymous users can submit reseller applications" ON reseller_applications;

-- Create a single, clear policy for anonymous reseller application submissions
CREATE POLICY "Enable anonymous reseller application submissions"
ON reseller_applications
FOR INSERT
TO anon, public
WITH CHECK (true);