-- Create storage policies for anonymous reseller application document uploads

-- Allow anonymous users to upload documents in the reseller-applications folder
CREATE POLICY "Allow anonymous uploads for reseller applications"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'reseller-applications'
);

-- Allow anonymous users to view their uploaded documents (for verification)
CREATE POLICY "Allow anonymous access to reseller application documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = 'reseller-applications'
);

-- Allow admins to access all documents in the bucket
CREATE POLICY "Allow admin access to all documents"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);