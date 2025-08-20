
-- 1) Recreate FK so deleting a brand cascades to brand_applications
ALTER TABLE public.brand_applications
  DROP CONSTRAINT IF EXISTS brand_applications_brand_id_fkey;

ALTER TABLE public.brand_applications
  ADD CONSTRAINT brand_applications_brand_id_fkey
  FOREIGN KEY (brand_id)
  REFERENCES public.brands_directory(id)
  ON DELETE CASCADE;

-- 2) Recreate FK so deleting a brand_application cascades to messages
ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_brand_application_id_fkey;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_brand_application_id_fkey
  FOREIGN KEY (brand_application_id)
  REFERENCES public.brand_applications(id)
  ON DELETE CASCADE;

-- 3) Update the admin_delete_brand function to remove dependents in the right order
CREATE OR REPLACE FUNCTION public.admin_delete_brand(p_brand_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Ensure caller is admin
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;

  -- Delete messages tied to applications for this brand
  DELETE FROM public.messages
  WHERE brand_application_id IN (
    SELECT id FROM public.brand_applications WHERE brand_id = p_brand_id
  );

  -- Keep email routing logs but detach them from the application
  UPDATE public.email_routing_logs
  SET application_id = NULL
  WHERE application_id IN (
    SELECT id FROM public.brand_applications WHERE brand_id = p_brand_id
  );

  -- Delete brand applications
  DELETE FROM public.brand_applications
  WHERE brand_id = p_brand_id;

  -- Delete brand reseller allocations
  DELETE FROM public.brand_reseller_allocations
  WHERE brand_id = p_brand_id;

  -- Delete any products associated with this brand
  DELETE FROM public.products
  WHERE brand_id = p_brand_id;

  -- Delete any product uploads associated with this brand
  DELETE FROM public.product_uploads
  WHERE brand_id = p_brand_id;

  -- Finally delete the brand itself
  DELETE FROM public.brands_directory
  WHERE id = p_brand_id;

  RETURN FOUND;
END;
$function$;
