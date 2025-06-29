
-- Drop and recreate the admin_get_brands function to include department
DROP FUNCTION IF EXISTS public.admin_get_brands();

CREATE OR REPLACE FUNCTION public.admin_get_brands()
 RETURNS TABLE(id uuid, name text, website_url text, description text, contact_email text, logo_url text, categories text[], is_active boolean, department text, approval_rate numeric, response_time numeric, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT 
    b.id,
    b.name,
    b.website_url,
    b.description,
    b.contact_email,
    b.logo_url,
    b.categories,
    b.is_active,
    b.department,
    b.approval_rate,
    b.response_time,
    b.created_at,
    b.updated_at
  FROM brands_directory b
  ORDER BY b.created_at DESC;
$function$;

-- Update the admin_add_brand function to include department
CREATE OR REPLACE FUNCTION public.admin_add_brand(brand_data jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  new_brand_id uuid;
BEGIN
  INSERT INTO brands_directory (
    name,
    website_url,
    description,
    contact_email,
    logo_url,
    categories,
    department,
    approval_rate,
    response_time,
    is_active
  ) VALUES (
    brand_data->>'name',
    brand_data->>'website_url',
    brand_data->>'description',
    brand_data->>'contact_email',
    brand_data->>'logo_url',
    CASE 
      WHEN brand_data->'categories' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(brand_data->'categories'))
      ELSE NULL
    END,
    brand_data->>'department',
    CASE 
      WHEN brand_data->>'approval_rate' IS NOT NULL 
      THEN (brand_data->>'approval_rate')::numeric
      ELSE NULL
    END,
    CASE 
      WHEN brand_data->>'response_time' IS NOT NULL 
      THEN (brand_data->>'response_time')::numeric
      ELSE NULL
    END,
    COALESCE((brand_data->>'is_active')::boolean, true)
  ) RETURNING id INTO new_brand_id;
  
  RETURN new_brand_id;
END;
$function$;

-- Update the admin_update_brand function to include department
CREATE OR REPLACE FUNCTION public.admin_update_brand(brand_id uuid, brand_data jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE brands_directory 
  SET 
    name = COALESCE(brand_data->>'name', name),
    website_url = COALESCE(brand_data->>'website_url', website_url),
    description = COALESCE(brand_data->>'description', description),
    contact_email = COALESCE(brand_data->>'contact_email', contact_email),
    logo_url = COALESCE(brand_data->>'logo_url', logo_url),
    categories = CASE 
      WHEN brand_data->'categories' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(brand_data->'categories'))
      ELSE categories
    END,
    department = COALESCE(brand_data->>'department', department),
    approval_rate = CASE 
      WHEN brand_data->>'approval_rate' IS NOT NULL 
      THEN (brand_data->>'approval_rate')::numeric
      ELSE approval_rate
    END,
    response_time = CASE 
      WHEN brand_data->>'response_time' IS NOT NULL 
      THEN (brand_data->>'response_time')::numeric
      ELSE response_time
    END,
    is_active = COALESCE((brand_data->>'is_active')::boolean, is_active),
    updated_at = COALESCE((brand_data->>'updated_at')::timestamp with time zone, now())
  WHERE id = brand_id;
  
  RETURN brand_id;
END;
$function$;
