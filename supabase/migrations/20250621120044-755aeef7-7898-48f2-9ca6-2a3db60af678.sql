
-- Drop the existing functions first to avoid parameter name conflicts
DROP FUNCTION IF EXISTS public.admin_allocate_brand_to_reseller(uuid, uuid);
DROP FUNCTION IF EXISTS public.admin_remove_brand_allocation(uuid, uuid);
DROP FUNCTION IF EXISTS public.admin_delete_brand(uuid);

-- Recreate the function to allocate brands to resellers with fixed parameter names
CREATE OR REPLACE FUNCTION public.admin_allocate_brand_to_reseller(p_brand_id uuid, p_reseller_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Insert allocation (ON CONFLICT DO NOTHING to handle duplicates)
  INSERT INTO brand_reseller_allocations (brand_id, reseller_id, allocated_by)
  VALUES (p_brand_id, p_reseller_id, auth.uid())
  ON CONFLICT (brand_id, reseller_id) DO NOTHING;
  
  RETURN true;
END;
$function$;

-- Recreate the function to remove brand allocation with fixed parameter names
CREATE OR REPLACE FUNCTION public.admin_remove_brand_allocation(p_brand_id uuid, p_reseller_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Delete the allocation with properly qualified column names
  DELETE FROM brand_reseller_allocations 
  WHERE brand_reseller_allocations.brand_id = p_brand_id 
    AND brand_reseller_allocations.reseller_id = p_reseller_id;
  
  RETURN FOUND;
END;
$function$;

-- Recreate the function to delete brands with fixed parameter names
CREATE OR REPLACE FUNCTION public.admin_delete_brand(p_brand_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Check if user is admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  
  -- Delete the brand with properly qualified column names
  DELETE FROM brands_directory WHERE brands_directory.id = p_brand_id;
  
  RETURN FOUND;
END;
$function$;
