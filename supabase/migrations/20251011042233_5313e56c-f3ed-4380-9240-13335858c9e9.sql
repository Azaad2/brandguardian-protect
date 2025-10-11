-- Create function to notify reseller on brand message reply
CREATE OR REPLACE FUNCTION notify_reseller_on_brand_reply()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sender_role text;
  v_recipient_role text;
  v_supabase_url text := 'https://flhqvkohslfxxfjzyzxy.supabase.co';
  v_anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHF2a29oc2xmeHhmanp5enh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzY3NDQsImV4cCI6MjA2MjkxMjc0NH0.uAtsP2PNN2Y8FsDzVWoV_GcTpkQ-1vDhIFxMGOjSB3E';
BEGIN
  -- Check if sender is a brand and recipient is a reseller
  SELECT user_role INTO v_sender_role 
  FROM profiles 
  WHERE id = NEW.sender_id;
  
  SELECT user_role INTO v_recipient_role 
  FROM profiles 
  WHERE id = NEW.recipient_id;
  
  -- Only trigger notification if brand is replying to reseller
  IF v_sender_role = 'brand' AND v_recipient_role = 'reseller' THEN
    -- Call edge function to send notification email
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-reseller-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_anon_key
      ),
      body := jsonb_build_object(
        'event_type', 'brand_reply',
        'reseller_id', NEW.recipient_id::text,
        'message_id', NEW.id::text,
        'brand_application_id', NEW.brand_application_id::text
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for brand replies
DROP TRIGGER IF EXISTS on_brand_message_received ON messages;
CREATE TRIGGER on_brand_message_received
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_reseller_on_brand_reply();

-- Create function to notify reseller on brand allocation
CREATE OR REPLACE FUNCTION notify_reseller_on_brand_allocation()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url text := 'https://flhqvkohslfxxfjzyzxy.supabase.co';
  v_anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHF2a29oc2xmeHhmanp5enh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzY3NDQsImV4cCI6MjA2MjkxMjc0NH0.uAtsP2PNN2Y8FsDzVWoV_GcTpkQ-1vDhIFxMGOjSB3E';
BEGIN
  -- Call edge function to send notification email
  PERFORM net.http_post(
    url := v_supabase_url || '/functions/v1/send-reseller-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_anon_key
    ),
    body := jsonb_build_object(
      'event_type', 'brand_allocated',
      'reseller_id', NEW.reseller_id::text,
      'brand_id', NEW.brand_id::text
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for brand allocations
DROP TRIGGER IF EXISTS on_brand_allocated ON brand_reseller_allocations;
CREATE TRIGGER on_brand_allocated
  AFTER INSERT ON brand_reseller_allocations
  FOR EACH ROW
  EXECUTE FUNCTION notify_reseller_on_brand_allocation();

-- Create function to notify reseller on application status change
CREATE OR REPLACE FUNCTION notify_reseller_on_application_status_change()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_supabase_url text := 'https://flhqvkohslfxxfjzyzxy.supabase.co';
  v_anon_key text := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHF2a29oc2xmeHhmanp5enh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzY3NDQsImV4cCI6MjA2MjkxMjc0NH0.uAtsP2PNN2Y8FsDzVWoV_GcTpkQ-1vDhIFxMGOjSB3E';
BEGIN
  -- Only trigger if status changed from pending to approved/rejected
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status IN ('approved', 'rejected') THEN
    -- Call edge function to send notification email
    PERFORM net.http_post(
      url := v_supabase_url || '/functions/v1/send-reseller-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || v_anon_key
      ),
      body := jsonb_build_object(
        'event_type', CASE 
          WHEN NEW.status = 'approved' THEN 'application_approved'
          WHEN NEW.status = 'rejected' THEN 'application_rejected'
        END,
        'reseller_id', NEW.reseller_id::text,
        'application_id', NEW.id::text
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for application status changes
DROP TRIGGER IF EXISTS on_application_status_changed ON brand_applications;
CREATE TRIGGER on_application_status_changed
  AFTER UPDATE OF status ON brand_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_reseller_on_application_status_change();