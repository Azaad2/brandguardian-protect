-- Make lead-magnets bucket public so files can be accessed via public URL
UPDATE storage.buckets 
SET public = true 
WHERE id = 'lead-magnets';