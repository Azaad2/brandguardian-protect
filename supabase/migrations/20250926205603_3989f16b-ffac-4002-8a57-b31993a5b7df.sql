-- Create table for lead magnet submissions
CREATE TABLE public.lead_magnets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  business_type TEXT,
  magnet_type TEXT NOT NULL DEFAULT 'amazon_ungated_brands',
  downloaded BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  last_downloaded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage all lead magnets" 
ON public.lead_magnets 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

CREATE POLICY "Users can view their own lead magnet submissions" 
ON public.lead_magnets 
FOR SELECT 
USING (email = auth.email());

-- Allow public inserts for lead capture
CREATE POLICY "Anyone can submit lead magnet requests" 
ON public.lead_magnets 
FOR INSERT 
WITH CHECK (true);

-- Create storage bucket for lead magnets
INSERT INTO storage.buckets (id, name, public) VALUES ('lead-magnets', 'lead-magnets', false);

-- Create policies for lead magnet files
CREATE POLICY "Admins can upload lead magnet files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'lead-magnets' AND 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_role = 'admin'
  )
);

CREATE POLICY "Authenticated users can download lead magnet files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'lead-magnets');