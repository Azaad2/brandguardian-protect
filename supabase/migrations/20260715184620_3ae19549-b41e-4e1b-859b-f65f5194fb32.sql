
CREATE TABLE public.daily_outreach_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  audience_type text NOT NULL CHECK (audience_type IN ('brand','distributor','reseller')),
  subject text,
  campaign_date date NOT NULL DEFAULT CURRENT_DATE,
  sent_at timestamptz NOT NULL DEFAULT now(),
  unsubscribed_at timestamptz,
  resend_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.daily_outreach_log TO authenticated;
GRANT ALL ON public.daily_outreach_log TO service_role;

ALTER TABLE public.daily_outreach_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view outreach log"
  ON public.daily_outreach_log FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE INDEX idx_daily_outreach_log_email_audience ON public.daily_outreach_log(email, audience_type);
CREATE INDEX idx_daily_outreach_log_sent_at ON public.daily_outreach_log(sent_at DESC);
CREATE INDEX idx_daily_outreach_log_unsub ON public.daily_outreach_log(email) WHERE unsubscribed_at IS NOT NULL;

-- Schedule daily job at 14:00 UTC
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.schedule(
  'daily-outreach-emails',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://flhqvkohslfxxfjzyzxy.supabase.co/functions/v1/daily-outreach-emails',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsaHF2a29oc2xmeHhmanp5enh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzY3NDQsImV4cCI6MjA2MjkxMjc0NH0.uAtsP2PNN2Y8FsDzVWoV_GcTpkQ-1vDhIFxMGOjSB3E'
    ),
    body := jsonb_build_object('scheduled', true, 'triggered_at', now())
  );
  $$
);
