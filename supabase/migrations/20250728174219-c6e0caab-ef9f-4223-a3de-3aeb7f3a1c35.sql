-- Let's completely disable RLS temporarily to test if the issue is with RLS
ALTER TABLE public.reseller_applications DISABLE ROW LEVEL SECURITY;

-- Check if there are any other constraints or issues
SELECT column_name, is_nullable, column_default, data_type 
FROM information_schema.columns 
WHERE table_name = 'reseller_applications' 
AND table_schema = 'public';

-- Also check if there are any triggers on this table
SELECT trigger_name, event_manipulation, action_statement 
FROM information_schema.triggers 
WHERE event_object_table = 'reseller_applications';