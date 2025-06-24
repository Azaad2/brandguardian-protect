
-- Add status column to profiles table to track user states
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted'));

-- Create index for better performance when filtering by status
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Create admin function to suspend a user
CREATE OR REPLACE FUNCTION public.admin_suspend_user(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Prevent admins from suspending themselves
  IF target_user_id = auth.uid() THEN
    RETURN false;
  END IF;
  
  -- Update user status to suspended
  UPDATE public.profiles 
  SET status = 'suspended', updated_at = now()
  WHERE id = target_user_id AND status != 'deleted';
  
  RETURN FOUND;
END;
$$;

-- Create admin function to activate a user
CREATE OR REPLACE FUNCTION public.admin_activate_user(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Update user status to active
  UPDATE public.profiles 
  SET status = 'active', updated_at = now()
  WHERE id = target_user_id AND status != 'deleted';
  
  RETURN FOUND;
END;
$$;

-- Create admin function to soft delete a user
CREATE OR REPLACE FUNCTION public.admin_soft_delete_user(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Prevent admins from deleting themselves
  IF target_user_id = auth.uid() THEN
    RETURN false;
  END IF;
  
  -- Update user status to deleted (soft delete)
  UPDATE public.profiles 
  SET status = 'deleted', updated_at = now()
  WHERE id = target_user_id;
  
  RETURN FOUND;
END;
$$;

-- Create admin function to update user profile
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  target_user_id uuid,
  new_full_name text DEFAULT NULL,
  new_company_name text DEFAULT NULL,
  new_user_role text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the calling user is an admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Update user profile with provided values
  UPDATE public.profiles 
  SET 
    full_name = COALESCE(new_full_name, full_name),
    company_name = COALESCE(new_company_name, company_name),
    user_role = COALESCE(new_user_role, user_role),
    updated_at = now()
  WHERE id = target_user_id AND status != 'deleted';
  
  RETURN FOUND;
END;
$$;

-- Update the admin_get_all_users function to filter out deleted users by default
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  company_name text,
  user_role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  bio text,
  status text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- Verify the calling user is an admin
  SELECT 
    p.id,
    p.email,
    p.full_name,
    p.company_name,
    p.user_role,
    p.created_at,
    p.updated_at,
    p.bio,
    COALESCE(p.status, 'active') as status
  FROM public.profiles p
  WHERE EXISTS (
    SELECT * FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() 
    AND admin_check.user_role = 'admin'
  )
  AND COALESCE(p.status, 'active') != 'deleted'
  ORDER BY p.created_at DESC;
$$;
