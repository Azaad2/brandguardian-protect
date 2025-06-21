
-- Update the admin_delete_brand function to handle foreign key constraints
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
  
  -- Delete related records first to avoid foreign key constraint violations
  -- Delete brand applications
  DELETE FROM brand_applications WHERE brand_id = p_brand_id;
  
  -- Delete brand reseller allocations
  DELETE FROM brand_reseller_allocations WHERE brand_id = p_brand_id;
  
  -- Delete any products associated with this brand
  DELETE FROM products WHERE brand_id = p_brand_id;
  
  -- Delete any product uploads associated with this brand
  DELETE FROM product_uploads WHERE brand_id = p_brand_id;
  
  -- Finally delete the brand itself
  DELETE FROM brands_directory WHERE id = p_brand_id;
  
  RETURN FOUND;
END;
$function$;
