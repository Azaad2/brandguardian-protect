-- Create update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create brand engagement emails tracking table
CREATE TABLE IF NOT EXISTS public.brand_engagement_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_email TEXT NOT NULL,
  brand_name TEXT,
  reseller_company TEXT,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('reply', 'approval', 'rejection')),
  email_sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_opened BOOLEAN DEFAULT FALSE,
  brand_signed_up BOOLEAN DEFAULT FALSE,
  application_id UUID REFERENCES public.brand_applications(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.brand_engagement_emails ENABLE ROW LEVEL SECURITY;

-- Admins can view all engagement emails
CREATE POLICY "Admins can view all brand engagement emails"
ON public.brand_engagement_emails
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Service role can insert (for edge functions)
CREATE POLICY "Service role can insert brand engagement emails"
ON public.brand_engagement_emails
FOR INSERT
TO service_role
WITH CHECK (TRUE);

-- Service role can update (for tracking opens/signups)
CREATE POLICY "Service role can update brand engagement emails"
ON public.brand_engagement_emails
FOR UPDATE
TO service_role
USING (TRUE)
WITH CHECK (TRUE);

-- Create indexes for faster lookups
CREATE INDEX idx_brand_engagement_emails_brand_email 
ON public.brand_engagement_emails(brand_email);

CREATE INDEX idx_brand_engagement_emails_created_at 
ON public.brand_engagement_emails(created_at DESC);

CREATE INDEX idx_brand_engagement_emails_signed_up 
ON public.brand_engagement_emails(brand_signed_up) 
WHERE brand_signed_up = TRUE;

-- Add trigger for updated_at
CREATE TRIGGER update_brand_engagement_emails_updated_at
BEFORE UPDATE ON public.brand_engagement_emails
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();