-- Fix invalid email addresses in brands_directory
UPDATE brands_directory 
SET contact_email = TRIM(SPLIT_PART(contact_email, ',', 1))
WHERE contact_email LIKE '%,%';

-- Update obviously invalid email addresses
UPDATE brands_directory 
SET contact_email = 'support@' || LOWER(name) || '.com'
WHERE contact_email NOT LIKE '%@%.%' 
   OR contact_email = 'domain.com'
   OR LENGTH(contact_email) < 5;