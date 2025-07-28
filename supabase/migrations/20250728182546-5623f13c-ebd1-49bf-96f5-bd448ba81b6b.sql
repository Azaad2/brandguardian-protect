-- Drop duplicate policies that are causing conflicts
DROP POLICY IF EXISTS "admins_can_delete_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_update_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "admins_can_view_all" ON public.reseller_applications;
DROP POLICY IF EXISTS "public_can_insert" ON public.reseller_applications;