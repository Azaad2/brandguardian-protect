-- Fix the get_reseller_brands_optimized function to ensure proper access
-- First check if it exists and recreate it with proper permissions

DROP FUNCTION IF EXISTS public.get_reseller_brands_optimized(uuid, text, text[], text[], text[], integer, integer);

CREATE OR REPLACE FUNCTION public.get_reseller_brands_optimized(
  p_reseller_id uuid,
  p_search_query text DEFAULT NULL,
  p_application_status text[] DEFAULT NULL,
  p_follow_up_filters text[] DEFAULT NULL,
  p_time_filters text[] DEFAULT NULL,
  p_limit integer DEFAULT 50,
  p_offset integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  name text,
  website_url text,
  description text,
  contact_email text,
  logo_url text,
  categories text[],
  is_active boolean,
  department text,
  approval_rate numeric,
  response_time numeric,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  application_status text,
  application_id uuid,
  application_created_at timestamp with time zone,
  follow_up_count integer,
  last_follow_up_at timestamp with time zone,
  response_expected_by timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  current_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
  RETURN QUERY
  WITH allocated_brands AS (
    SELECT bra.brand_id
    FROM brand_reseller_allocations bra
    WHERE bra.reseller_id = p_reseller_id
  ),
  brands_with_apps AS (
    SELECT 
      bd.*,
      ba.status as application_status,
      ba.id as application_id,
      ba.created_at as application_created_at,
      COALESCE(ba.follow_up_count, 0) as follow_up_count,
      ba.last_follow_up_at,
      ba.response_expected_by
    FROM brands_directory bd
    INNER JOIN allocated_brands ab ON bd.id = ab.brand_id
    LEFT JOIN brand_applications ba ON bd.id = ba.brand_id AND ba.reseller_id = p_reseller_id
    WHERE bd.is_active = true
  ),
  filtered_brands AS (
    SELECT *
    FROM brands_with_apps bwa
    WHERE 
      -- Search filter
      (p_search_query IS NULL OR 
       bwa.name ILIKE '%' || p_search_query || '%' OR 
       bwa.description ILIKE '%' || p_search_query || '%' OR
       bwa.department ILIKE '%' || p_search_query || '%')
      
      -- Application status filter
      AND (p_application_status IS NULL OR 
           (bwa.application_status IS NULL AND 'not_applied' = ANY(p_application_status)) OR
           (bwa.application_status = ANY(p_application_status)))
      
      -- Follow-up filters
      AND (p_follow_up_filters IS NULL OR
           ('need_followup' = ANY(p_follow_up_filters) AND 
            bwa.application_status = 'pending' AND 
            bwa.follow_up_count < 3 AND
            (bwa.last_follow_up_at IS NULL OR bwa.last_follow_up_at < current_time - INTERVAL '3 days')) OR
           ('followup_sent' = ANY(p_follow_up_filters) AND bwa.follow_up_count > 0) OR
           ('max_followups' = ANY(p_follow_up_filters) AND bwa.follow_up_count >= 3))
      
      -- Time-based filters
      AND (p_time_filters IS NULL OR
           ('recently_applied' = ANY(p_time_filters) AND 
            bwa.application_created_at > current_time - INTERVAL '7 days') OR
           ('waiting_long' = ANY(p_time_filters) AND 
            bwa.application_created_at < current_time - INTERVAL '14 days' AND
            bwa.application_status = 'pending') OR
           ('response_expected' = ANY(p_time_filters) AND 
            bwa.response_expected_by < current_time AND
            bwa.application_status = 'pending'))
  )
  SELECT 
    fb.id,
    fb.name,
    fb.website_url,
    fb.description,
    fb.contact_email,
    fb.logo_url,
    fb.categories,
    fb.is_active,
    fb.department,
    fb.approval_rate,
    fb.response_time,
    fb.created_at,
    fb.updated_at,
    fb.application_status,
    fb.application_id,
    fb.application_created_at,
    fb.follow_up_count,
    fb.last_follow_up_at,
    fb.response_expected_by
  FROM filtered_brands fb
  ORDER BY 
    CASE 
      WHEN fb.application_status IS NULL THEN 0 -- Not applied brands first
      WHEN fb.application_status = 'pending' THEN 1 -- Then pending
      ELSE 2 -- Then others
    END,
    fb.name
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_reseller_brands_optimized(uuid, text, text[], text[], text[], integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_reseller_brands_optimized(uuid, text, text[], text[], text[], integer, integer) TO anon;