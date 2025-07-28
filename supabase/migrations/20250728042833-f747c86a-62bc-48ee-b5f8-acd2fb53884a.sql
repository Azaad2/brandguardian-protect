-- Fix RLS policies for reseller_applications table to resolve 401 errors

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anonymous can submit applications" ON reseller_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON reseller_applications;  
DROP POLICY IF EXISTS "Admins can update applications" ON reseller_applications;
DROP POLICY IF EXISTS "Admins can delete applications" ON reseller_applications;
DROP POLICY IF EXISTS "Users can view own applications" ON reseller_applications;

-- Create specific, non-overlapping policies
-- Allow anonymous users to submit applications
CREATE POLICY "Anonymous can submit applications"
ON reseller_applications
FOR INSERT
TO anon, public
WITH CHECK (true);

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON reseller_applications  
FOR SELECT
TO authenticated
USING (get_current_user_role() = 'admin');

-- Allow admins to update applications
CREATE POLICY "Admins can update applications"
ON reseller_applications
FOR UPDATE
TO authenticated
USING (get_current_user_role() = 'admin');

-- Allow admins to delete applications
CREATE POLICY "Admins can delete applications"
ON reseller_applications
FOR DELETE  
TO authenticated
USING (get_current_user_role() = 'admin');

-- Allow users to view their own applications
CREATE POLICY "Users can view own applications"
ON reseller_applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());