-- Add columns to store temporary password information
ALTER TABLE public.reseller_applications 
ADD COLUMN IF NOT EXISTS temporary_password TEXT,
ADD COLUMN IF NOT EXISTS password_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS password_reset_count INTEGER DEFAULT 0;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reseller_applications_user_id ON public.reseller_applications(user_id);

-- Add comment for documentation
COMMENT ON COLUMN public.reseller_applications.temporary_password IS 'Stores the temporary password sent to reseller during approval';
COMMENT ON COLUMN public.reseller_applications.password_sent_at IS 'Timestamp when the password was last sent to reseller';
COMMENT ON COLUMN public.reseller_applications.password_reset_count IS 'Number of times password has been reset for this application';