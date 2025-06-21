
-- Add the missing columns to the brands_directory table
ALTER TABLE public.brands_directory 
ADD COLUMN department text,
ADD COLUMN approval_rate numeric,
ADD COLUMN response_time numeric;
