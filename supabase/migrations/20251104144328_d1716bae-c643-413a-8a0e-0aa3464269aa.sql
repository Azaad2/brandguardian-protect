-- Fix admin_allocate_brand_to_reseller to check auth FIRST
CREATE OR REPLACE FUNCTION public.admin_allocate_brand_to_reseller(p_brand_id uuid, p_reseller_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_admin_id uuid;
BEGIN
  -- FIRST: Get and validate the admin user ID (check session BEFORE checking admin role)
  v_admin_id := auth.uid();
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required. Please log out and log back in.';
  END IF;
  
  -- SECOND: Check if user is admin (only after confirming they have a valid session)
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;
  
  -- Insert allocation (ON CONFLICT DO NOTHING to handle duplicates)
  INSERT INTO brand_reseller_allocations (brand_id, reseller_id, allocated_by)
  VALUES (p_brand_id, p_reseller_id, v_admin_id)
  ON CONFLICT (brand_id, reseller_id) DO NOTHING;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Failed to allocate brand: %', SQLERRM;
END;
$function$;