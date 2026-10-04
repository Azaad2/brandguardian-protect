CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug = lower(slug) AND slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text NOT NULL,
  excerpt text NOT NULL,
  content_html text NOT NULL,
  author text NOT NULL DEFAULT 'BndBox Team',
  audience text NOT NULL CHECK (audience IN ('reseller', 'brand', 'distributor', 'wholesaler', 'retailer')),
  category text NOT NULL,
  primary_keyword text NOT NULL,
  secondary_keywords text[] NOT NULL DEFAULT '{}',
  search_intent text NOT NULL DEFAULT 'informational',
  image_url text NOT NULL DEFAULT '/og-images/homepage.jpg',
  image_alt text NOT NULL,
  read_time text NOT NULL,
  source_notes jsonb NOT NULL DEFAULT '[]'::jsonb,
  quality_score integer NOT NULL DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'rejected')),
  published_on date,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT published_fields_required CHECK (
    status <> 'published' OR (published_on IS NOT NULL AND published_at IS NOT NULL)
  )
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blog posts are public"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published' AND published_at <= now());

CREATE TABLE public.blog_topic_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  proposed_title text NOT NULL,
  audience text NOT NULL CHECK (audience IN ('reseller', 'brand', 'distributor', 'wholesaler', 'retailer')),
  category text NOT NULL,
  search_intent text NOT NULL DEFAULT 'informational',
  search_volume integer,
  keyword_difficulty integer,
  source text NOT NULL DEFAULT 'editorial',
  source_checked_at timestamptz,
  priority integer NOT NULL DEFAULT 50 CHECK (priority BETWEEN 0 AND 100),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'selected', 'published', 'rejected')),
  selected_at timestamptz,
  published_post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (keyword)
);
GRANT ALL ON public.blog_topic_queue TO service_role;
ALTER TABLE public.blog_topic_queue ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.blog_automation_state (
  job_name text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT true,
  daily_publish_limit integer NOT NULL DEFAULT 1 CHECK (daily_publish_limit = 1),
  audience_cursor integer NOT NULL DEFAULT 0 CHECK (audience_cursor BETWEEN 0 AND 4),
  locked_until timestamptz,
  lock_token uuid,
  last_started_at timestamptz,
  last_completed_at timestamptz,
  paused_reason text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_automation_state TO authenticated;
GRANT ALL ON public.blog_automation_state TO service_role;
ALTER TABLE public.blog_automation_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view blog automation state"
  ON public.blog_automation_state FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE TABLE public.blog_generation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('running', 'published', 'skipped', 'paused', 'failed', 'denied')),
  topic_id uuid REFERENCES public.blog_topic_queue(id) ON DELETE SET NULL,
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE SET NULL,
  audience text,
  error_message text,
  gateway_run_id text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_generation_runs TO authenticated;
GRANT ALL ON public.blog_generation_runs TO service_role;
ALTER TABLE public.blog_generation_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view blog generation runs"
  ON public.blog_generation_runs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE UNIQUE INDEX blog_posts_one_daily_publication
  ON public.blog_posts (published_on)
  WHERE status = 'published';
CREATE INDEX blog_posts_public_order
  ON public.blog_posts (published_at DESC)
  WHERE status = 'published';
CREATE INDEX blog_topic_queue_selection
  ON public.blog_topic_queue (status, audience, priority DESC, created_at);
CREATE INDEX blog_generation_runs_recent
  ON public.blog_generation_runs (started_at DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_blog_topic_queue_updated_at
BEFORE UPDATE ON public.blog_topic_queue
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER set_blog_automation_state_updated_at
BEFORE UPDATE ON public.blog_automation_state
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.blog_automation_state (job_name)
VALUES ('daily-blog-publisher');

CREATE OR REPLACE FUNCTION public.claim_daily_blog_publisher()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed_token uuid := gen_random_uuid();
BEGIN
  UPDATE public.blog_automation_state
  SET lock_token = claimed_token,
      locked_until = now() + interval '20 minutes',
      last_started_at = now()
  WHERE job_name = 'daily-blog-publisher'
    AND enabled = true
    AND paused_reason IS NULL
    AND (locked_until IS NULL OR locked_until < now());

  IF FOUND THEN
    RETURN claimed_token;
  END IF;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_daily_blog_publisher() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_daily_blog_publisher() TO service_role;

CREATE OR REPLACE FUNCTION public.release_daily_blog_publisher(_lock_token uuid, _advance_audience boolean DEFAULT false)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_automation_state
  SET lock_token = NULL,
      locked_until = NULL,
      last_completed_at = now(),
      audience_cursor = CASE WHEN _advance_audience THEN (audience_cursor + 1) % 5 ELSE audience_cursor END
  WHERE job_name = 'daily-blog-publisher'
    AND lock_token = _lock_token;
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.release_daily_blog_publisher(uuid, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_daily_blog_publisher(uuid, boolean) TO service_role;

INSERT INTO public.blog_topic_queue
  (keyword, proposed_title, audience, category, search_intent, search_volume, keyword_difficulty, source, source_checked_at, priority)
VALUES
  ('where to buy wholesale products to sell on amazon', 'Where to Buy Wholesale Products to Sell on Amazon', 'reseller', 'Amazon Wholesale', 'commercial', 320, NULL, 'Semrush US', now(), 96),
  ('how to find wholesale suppliers for amazon fba', 'How to Find Reliable Wholesale Suppliers for Amazon FBA', 'reseller', 'Amazon FBA', 'informational', 90, NULL, 'Semrush US', now(), 88),
  ('what is amazon wholesale', 'What Is Amazon Wholesale? A Plain-English Guide', 'reseller', 'Amazon Wholesale', 'informational', 70, NULL, 'Semrush US', now(), 78),
  ('how to become a wholesale distributor', 'How to Become a Wholesale Distributor', 'distributor', 'Wholesale Distribution', 'informational', 170, NULL, 'Semrush US', now(), 91),
  ('what is a wholesale distributor', 'What Is a Wholesale Distributor and How Do They Make Money?', 'distributor', 'Wholesale Distribution', 'informational', 140, NULL, 'Semrush US', now(), 87),
  ('how to find wholesale distributors', 'How Brands Can Find the Right Wholesale Distributors', 'brand', 'Distribution Strategy', 'commercial', 110, NULL, 'Semrush US', now(), 89),
  ('how to choose a wholesale distributor', 'How to Choose a Wholesale Distributor for Your Brand', 'brand', 'Distribution Strategy', 'commercial', 30, NULL, 'Semrush US', now(), 82),
  ('distributor vs wholesaler', 'Distributor vs. Wholesaler: What Is the Difference?', 'wholesaler', 'Wholesale Basics', 'informational', 30, NULL, 'Semrush US', now(), 84),
  ('how retailers find wholesale suppliers', 'How Retailers Can Find Reliable Wholesale Suppliers', 'retailer', 'Retail Sourcing', 'commercial', NULL, NULL, 'BndBox content gap', now(), 86),
  ('multi channel distribution strategy', 'How to Build a Multi-Channel Distribution Strategy', 'brand', 'Distribution Strategy', 'informational', NULL, NULL, 'Semrush US content gap', now(), 80)
ON CONFLICT (keyword) DO NOTHING;