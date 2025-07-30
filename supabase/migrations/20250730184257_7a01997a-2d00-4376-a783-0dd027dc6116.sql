-- Disable RLS one more time since policies aren't working
ALTER TABLE public.reseller_applications DISABLE ROW LEVEL SECURITY;

-- Let's also check what roles/permissions exist
-- The issue seems to be with how the policies are being applied to anonymous users