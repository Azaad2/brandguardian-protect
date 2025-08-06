-- Update all existing subscribers to have unlimited brand applications
UPDATE public.subscribers 
SET brand_application_limit = 999999
WHERE brand_application_limit = 3 OR brand_application_limit < 999999;

-- Update the default brand_application_limit for new subscribers  
ALTER TABLE public.subscribers 
ALTER COLUMN brand_application_limit SET DEFAULT 999999;