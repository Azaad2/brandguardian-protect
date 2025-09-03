
-- 1) Ensure brand_reseller_allocations can properly embed/join brands_directory
DO $$
BEGIN
  ALTER TABLE public.brand_reseller_allocations
    ADD CONSTRAINT brand_reseller_allocations_brand_fk
    FOREIGN KEY (brand_id) REFERENCES public.brands_directory(id) ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END$$;

-- 2) Add a column to map an allocated brand to its auth profile (used by products/orders)
ALTER TABLE public.brand_reseller_allocations
  ADD COLUMN IF NOT EXISTS brand_profile_id uuid;

-- 3) Helpful indexes
CREATE INDEX IF NOT EXISTS idx_brand_alloc_reseller_id ON public.brand_reseller_allocations(reseller_id);
CREATE INDEX IF NOT EXISTS idx_brand_alloc_brand_id ON public.brand_reseller_allocations(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_alloc_brand_profile_id ON public.brand_reseller_allocations(brand_profile_id);
