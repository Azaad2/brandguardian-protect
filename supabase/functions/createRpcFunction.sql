
-- This file describes the RPC function that needs to be created in Supabase SQL editor
-- to allow profile creation that bypasses RLS policies

-- Create a function that allows creating profiles via RPC call
CREATE OR REPLACE FUNCTION create_user_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT,
  user_company_name TEXT,
  user_role TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- This is important to bypass RLS
AS $$
BEGIN
  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id) THEN
    RETURN FALSE;
  END IF;

  -- Insert the new profile
  INSERT INTO public.profiles (id, email, full_name, company_name, user_role)
  VALUES (
    user_id,
    user_email,
    user_full_name,
    user_company_name,
    user_role
  );
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Ensure everyone can execute this function
GRANT EXECUTE ON FUNCTION create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION create_user_profile TO anon;
GRANT EXECUTE ON FUNCTION create_user_profile TO service_role;
