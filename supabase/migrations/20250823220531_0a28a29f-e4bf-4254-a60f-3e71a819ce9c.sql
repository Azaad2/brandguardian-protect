-- Add follow-up tracking fields to brand_applications table
ALTER TABLE brand_applications 
ADD COLUMN IF NOT EXISTS follow_up_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_follow_up_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS response_expected_by TIMESTAMP WITH TIME ZONE;

-- Create follow_up_messages table to track follow-up history
CREATE TABLE IF NOT EXISTS follow_up_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_application_id UUID NOT NULL REFERENCES brand_applications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message_content TEXT NOT NULL,
  follow_up_type TEXT NOT NULL CHECK (follow_up_type IN ('gentle_reminder', 'second_followup', 'final_followup', 'custom')),
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_sent BOOLEAN DEFAULT false,
  email_delivery_status TEXT DEFAULT 'pending'
);

-- Enable RLS for follow_up_messages
ALTER TABLE follow_up_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for follow_up_messages
CREATE POLICY "Users can view their own follow-up messages" ON follow_up_messages
  FOR SELECT USING (sender_id = auth.uid());

CREATE POLICY "Users can create their own follow-up messages" ON follow_up_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Admins can view all follow-up messages" ON follow_up_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.user_role = 'admin'
    )
  );

-- Create function to calculate response_expected_by
CREATE OR REPLACE FUNCTION update_response_expected_by()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate expected response time based on brand's response_time (in hours)
  IF NEW.status = 'pending' THEN
    NEW.response_expected_by := NEW.created_at + INTERVAL '1 hour' * COALESCE(
      (SELECT response_time FROM brands_directory WHERE id = NEW.brand_id), 
      72 -- Default to 72 hours if no response time specified
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate response_expected_by
DROP TRIGGER IF EXISTS set_response_expected_by ON brand_applications;
CREATE TRIGGER set_response_expected_by
  BEFORE INSERT OR UPDATE ON brand_applications
  FOR EACH ROW EXECUTE FUNCTION update_response_expected_by();

-- Update existing records to have response_expected_by
UPDATE brand_applications 
SET response_expected_by = created_at + INTERVAL '1 hour' * COALESCE(
  (SELECT response_time FROM brands_directory WHERE id = brand_applications.brand_id), 
  72
)
WHERE response_expected_by IS NULL;