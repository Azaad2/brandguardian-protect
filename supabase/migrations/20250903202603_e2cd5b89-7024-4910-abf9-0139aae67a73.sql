-- Add FK and indexes for brand_reseller_allocations.brand_id -> brands_directory.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'brand_reseller_allocations_brand_id_fkey'
  ) THEN
    ALTER TABLE public.brand_reseller_allocations
    ADD CONSTRAINT brand_reseller_allocations_brand_id_fkey
    FOREIGN KEY (brand_id)
    REFERENCES public.brands_directory(id)
    ON DELETE CASCADE;
  END IF;
END $$;

-- Helpful indexes for lookups
CREATE INDEX IF NOT EXISTS idx_brand_reseller_allocations_reseller
  ON public.brand_reseller_allocations (reseller_id);

CREATE INDEX IF NOT EXISTS idx_brand_reseller_allocations_brand
  ON public.brand_reseller_allocations (brand_id);

CREATE INDEX IF NOT EXISTS idx_brand_reseller_allocations_brand_profile
  ON public.brand_reseller_allocations (brand_profile_id);
