CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

SELECT cron.unschedule(jobid)
FROM cron.job
WHERE jobname IN ('daily-blog-publisher', 'daily-outreach-emails');

SELECT cron.schedule(
  'daily-blog-publisher',
  '0 12 * * *',
  $$
  SELECT net.http_post(
    url := 'https://flhqvkohslfxxfjzyzxy.supabase.co/functions/v1/daily-blog-publisher',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('scheduled', true, 'triggered_at', now())
  );
  $$
);

SELECT cron.schedule(
  'daily-outreach-emails',
  '0 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://flhqvkohslfxxfjzyzxy.supabase.co/functions/v1/daily-outreach-emails',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('scheduled', true, 'triggered_at', now())
  );
  $$
);