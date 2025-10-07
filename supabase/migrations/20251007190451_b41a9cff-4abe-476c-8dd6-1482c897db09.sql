-- Add full_content column to email_routing_logs table for complete email storage
ALTER TABLE email_routing_logs 
ADD COLUMN IF NOT EXISTS full_content TEXT;

-- Add index on thread_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_routing_logs_thread_id ON email_routing_logs(thread_id);

-- Add index on sender_email for faster sender lookups
CREATE INDEX IF NOT EXISTS idx_email_routing_logs_sender ON email_routing_logs(sender_email);

-- Add index on status for filtering
CREATE INDEX IF NOT EXISTS idx_email_routing_logs_status ON email_routing_logs(status);

-- Add application_id index for application-based queries
CREATE INDEX IF NOT EXISTS idx_email_routing_logs_application ON email_routing_logs(application_id);