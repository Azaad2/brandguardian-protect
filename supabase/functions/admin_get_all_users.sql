
CREATE OR REPLACE FUNCTION public.admin_get_all_users()
RETURNS TABLE(
  id uuid,
  email text,
  full_name text,
  company_name text,
  user_role text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  bio text
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
    p.bio
  FROM public.profiles p
  WHERE EXISTS (
    SELECT * FROM public.profiles admin_check 
    WHERE admin_check.id = auth.uid() 
    AND admin_check.user_role = 'admin'
  )
  ORDER BY p.created_at DESC;
$$;
