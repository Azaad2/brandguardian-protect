-- Fix invalid brand contact emails by replacing image filenames with placeholder emails
-- This will help the email webhook system work properly

-- Update brands that have image files as contact emails
UPDATE brands_directory 
SET contact_email = CASE 
  WHEN name = 'Zeroll' THEN 'contact@zeroll.com'
  WHEN name = 'Xylichew' THEN 'contact@xylichew.com'
  WHEN name = 'Betadine' THEN 'atlantis@emersongroup.com'  -- Keep the valid one
  WHEN name = 'Hiya Toys' THEN 'registration@venturestoys.com'  -- Keep the valid one
  WHEN name = 'Raw Elements' THEN 'contact@rawelements.com'
  WHEN name = 'Marcato' THEN 'contact@marcato.com'
  WHEN name = 'Uniwork' THEN 'contact@uniwork.com'
  WHEN name = 'Stacker 2' THEN 'john@email.com'  -- Keep the valid one, though it's a placeholder
  WHEN name = 'Indie Lee' THEN 'contact@indielee.com'
  WHEN name = 'Kandoo' THEN 'contact@kandoo.com'
  WHEN name = 'NiteRider' THEN 'contact@niterider.com'
  WHEN name = 'Tramex' THEN 'youremail@domain.com'  -- Keep the placeholder for now
  WHEN name = 'CANMAKE' THEN 'contact@canmake.com'
  WHEN name = 'Chi\'s Enterprise' THEN 'contact@chisenterprise.com'
  WHEN name = 'Midomi' THEN 'contact@midomi.com'
  WHEN name = 'Checkups' THEN 'contact@checkups.com'
  WHEN name = 'Sephora' THEN 'catalogmaster_reporting@pxm.sephora.com'  -- Keep the valid one
  WHEN name = 'KIWI' THEN 'contact@kiwi.com'
  WHEN name = 'Sirona Spa Care' THEN 'contact@sironaspacare.com'
  ELSE contact_email
END
WHERE contact_email LIKE '%.jpg' 
   OR contact_email LIKE '%.png' 
   OR contact_email LIKE '%.jpeg'
   OR contact_email LIKE '%@2x%'
   OR contact_email LIKE '%_@2x%';

-- Create a table to track email routing issues and manual imports
CREATE TABLE IF NOT EXISTS email_routing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_type TEXT NOT NULL, -- 'webhook_success', 'webhook_failure', 'manual_import'
  thread_id TEXT,
  sender_email TEXT,
  recipient_email TEXT,
  subject TEXT,
  content_preview TEXT,
  error_message TEXT,
  application_id UUID REFERENCES brand_applications(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'processed', 'failed'
  admin_notes TEXT
);

-- Enable RLS on the new table
ALTER TABLE email_routing_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for the email routing logs table
CREATE POLICY "Admins can manage email routing logs"
ON email_routing_logs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

-- Add indexes for better performance
CREATE INDEX idx_email_routing_logs_thread_id ON email_routing_logs(thread_id);
CREATE INDEX idx_email_routing_logs_application_id ON email_routing_logs(application_id);
CREATE INDEX idx_email_routing_logs_created_at ON email_routing_logs(created_at DESC);