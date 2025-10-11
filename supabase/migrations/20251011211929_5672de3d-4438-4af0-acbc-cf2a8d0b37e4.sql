-- Add email tracking columns to brand_applications table
ALTER TABLE brand_applications 
ADD COLUMN IF NOT EXISTS email_id TEXT,
ADD COLUMN IF NOT EXISTS email_opened BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_opened_at TIMESTAMPTZ;

-- Create index for email_id lookups
CREATE INDEX IF NOT EXISTS idx_brand_applications_email_id 
ON brand_applications(email_id) 
WHERE email_id IS NOT NULL;

-- Update interaction type constraint to include email_open
ALTER TABLE brand_engagement_emails 
DROP CONSTRAINT IF EXISTS brand_engagement_emails_interaction_type_check;

ALTER TABLE brand_engagement_emails 
ADD CONSTRAINT brand_engagement_emails_interaction_type_check 
CHECK (interaction_type IN ('reply', 'approval', 'rejection', 'email_open'));