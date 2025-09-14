-- Create a function to count brands with filters applied
CREATE OR REPLACE FUNCTION public.get_reseller_brands_count(
  p_reseller_id uuid,
  p_search_query text DEFAULT NULL,
  p_application_status text[] DEFAULT NULL,
  p_follow_up_filters text[] DEFAULT NULL,
  p_time_filters text[] DEFAULT NULL
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN (
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
      SELECT COUNT(*) as total
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
              (bwa.last_follow_up_at IS NULL OR bwa.last_follow_up_at < (now() - interval '3 days'))) OR
             ('followup_sent' = ANY(p_follow_up_filters) AND bwa.follow_up_count > 0) OR
             ('max_followups' = ANY(p_follow_up_filters) AND bwa.follow_up_count >= 3))
        
        -- Time-based filters
        AND (p_time_filters IS NULL OR
             ('recently_applied' = ANY(p_time_filters) AND 
              bwa.application_created_at > (now() - interval '7 days')) OR
             ('waiting_long' = ANY(p_time_filters) AND 
              bwa.application_created_at < (now() - interval '14 days') AND
              bwa.application_status = 'pending') OR
             ('response_expected' = ANY(p_time_filters) AND 
              bwa.response_expected_by < now() AND
              bwa.application_status = 'pending'))
    )
    SELECT total FROM filtered_brands
  );
END;
$$;