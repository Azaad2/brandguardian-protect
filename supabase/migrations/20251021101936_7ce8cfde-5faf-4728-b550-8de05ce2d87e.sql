-- Make contact_email nullable in distributors table
ALTER TABLE distributors 
ALTER COLUMN contact_email DROP NOT NULL;