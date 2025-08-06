-- Enable RLS on all public tables that might be missing it
-- Check and enable RLS on any tables that might be missing it

-- Enable RLS on subscribers table if not already enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Ensure all other critical tables have RLS enabled  
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_reseller_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;