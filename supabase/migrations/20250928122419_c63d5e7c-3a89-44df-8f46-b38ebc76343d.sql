-- Make name field nullable in lead_magnets table to support email-only submissions
ALTER TABLE public.lead_magnets 
ALTER COLUMN name DROP NOT NULL;