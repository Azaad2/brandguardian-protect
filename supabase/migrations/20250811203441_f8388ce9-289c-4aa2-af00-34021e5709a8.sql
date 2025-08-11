-- Fix infinite recursion in profiles table RLS policies

-- Drop the problematic policy that causes circular dependency
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Update the is_admin function to be SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  );
$$;

-- Create a new admin policy that uses the security definer function
CREATE POLICY "Admins can view all profiles via function" 
ON public.profiles 
FOR SELECT 
USING (public.is_admin());

-- Ensure admin users can also update other profiles
CREATE POLICY "Admins can update all profiles via function" 
ON public.profiles 
FOR UPDATE 
USING (public.is_admin());

-- Ensure admin users can delete profiles
CREATE POLICY "Admins can delete profiles via function" 
ON public.profiles 
FOR DELETE 
USING (public.is_admin());