-- Fix admin_allocate_brand_to_reseller function to properly handle admin user ID
CREATE OR REPLACE FUNCTION public.admin_allocate_brand_to_reseller(p_brand_id uuid, p_reseller_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Get the admin user ID
  v_admin_id := auth.uid();
  
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'User is not an admin';
  END IF;
  
  -- Ensure we have a valid admin ID
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Unable to determine admin user ID';
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