
-- Fix ambiguous column reference errors in brand allocation functions

-- Update the function to allocate brands to resellers
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

-- Update the function to remove brand allocation
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
  
  -- Delete the allocation
  DELETE FROM brand_reseller_allocations 
  WHERE brand_id = p_brand_id AND reseller_id = p_reseller_id;
  
  RETURN FOUND;
END;
$function$;

-- Update the function to delete brands
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
  
  -- Delete the brand (cascading will handle related records)
  DELETE FROM brands_directory WHERE id = p_brand_id;
  
  RETURN FOUND;
END;
$function$;
