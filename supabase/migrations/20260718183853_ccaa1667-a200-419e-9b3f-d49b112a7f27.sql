
CREATE TABLE public.user_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
CREATE INDEX idx_user_activity_email_time ON public.user_activity (email, occurred_at desc);
CREATE INDEX idx_user_activity_event_time ON public.user_activity (event_type, occurred_at desc);
CREATE INDEX idx_user_activity_user_time ON public.user_activity (user_id, occurred_at desc);

GRANT SELECT ON public.user_activity TO authenticated;
GRANT ALL ON public.user_activity TO service_role;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own activity" ON public.user_activity FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view all activity" ON public.user_activity FOR SELECT TO authenticated USING (public.is_admin());

CREATE TABLE public.lifecycle_email_log (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  journey text not null,
  stage text not null,
  subject text,
  resend_id text,
  sent_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);
CREATE UNIQUE INDEX idx_lifecycle_unique_stage ON public.lifecycle_email_log (email, journey, stage) WHERE unsubscribed_at IS NULL;
CREATE INDEX idx_lifecycle_email_time ON public.lifecycle_email_log (email, sent_at desc);

GRANT SELECT ON public.lifecycle_email_log TO authenticated;
GRANT ALL ON public.lifecycle_email_log TO service_role;
ALTER TABLE public.lifecycle_email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view lifecycle log" ON public.lifecycle_email_log FOR SELECT TO authenticated USING (public.is_admin());
