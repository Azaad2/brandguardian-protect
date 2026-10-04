CREATE POLICY "Publishing service manages blog topic queue"
  ON public.blog_topic_queue FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);