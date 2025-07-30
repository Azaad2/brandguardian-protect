-- Temporarily disable RLS to confirm it works
ALTER TABLE public.reseller_applications DISABLE ROW LEVEL SECURITY;

-- Grant explicit permissions to anon role
GRANT INSERT ON public.reseller_applications TO anon;
GRANT INSERT ON public.reseller_applications TO authenticated;