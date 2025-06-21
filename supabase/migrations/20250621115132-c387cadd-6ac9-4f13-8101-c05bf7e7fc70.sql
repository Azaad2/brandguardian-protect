
-- Create a table to manage brand-reseller allocations
CREATE TABLE public.brand_reseller_allocations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id uuid NOT NULL REFERENCES public.brands_directory(id) ON DELETE CASCADE,
  reseller_id uuid NOT NULL,
  allocated_by uuid NOT NULL,
  allocated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(brand_id, reseller_id)
);

-- Enable RLS on the allocation table
ALTER TABLE public.brand_reseller_allocations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brand allocations
CREATE POLICY "Admins can manage all brand allocations" 
  ON public.brand_reseller_allocations 
  FOR ALL 
  USING (public.is_admin());

CREATE POLICY "Resellers can view their allocated brands" 
  ON public.brand_reseller_allocations 
  FOR SELECT 
  USING (reseller_id = auth.uid());

-- Add a function to delete brands (admin only)
CREATE OR REPLACE FUNCTION public.admin_delete_brand(brand_id uuid)
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
  DELETE FROM brands_directory WHERE id = brand_id;
  
  RETURN FOUND;
END;
$function$;

-- Add a function to allocate brands to resellers
CREATE OR REPLACE FUNCTION public.admin_allocate_brand_to_reseller(brand_id uuid, reseller_id uuid)
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
  VALUES (brand_id, reseller_id, auth.uid())
  ON CONFLICT (brand_id, reseller_id) DO NOTHING;
  
  RETURN true;
END;
$function$;

-- Add a function to remove brand allocation
CREATE OR REPLACE FUNCTION public.admin_remove_brand_allocation(brand_id uuid, reseller_id uuid)
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
  WHERE brand_id = brand_id AND reseller_id = reseller_id;
  
  RETURN FOUND;
END;
$function$;
