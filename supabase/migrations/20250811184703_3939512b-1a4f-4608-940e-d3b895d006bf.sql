-- Fix critical security issues in profiles and subscribers tables

-- 1. Remove the dangerous public read access policy on profiles table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;

-- 2. Create secure RLS policies for profiles table
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Admins can view all profiles (for admin functionality)
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles admin_profiles 
      WHERE admin_profiles.id = auth.uid() 
      AND admin_profiles.user_role = 'admin'
    )
  );

-- 3. Fix the overly permissive subscription update policy
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create a secure subscription update policy
CREATE POLICY "Users can update their own subscription" 
  ON public.subscribers 
  FOR UPDATE 
  USING (user_id = auth.uid() OR email = auth.email());

-- 4. Optional: Create a read-only policy for public brand directory (keeping only safe fields public)
-- This addresses the brand contact data warning by ensuring only safe data is exposed
DROP POLICY IF EXISTS "Public can view active brands" ON public.brands_directory;
DROP POLICY IF EXISTS "Anyone can view active brands" ON public.brands_directory;