-- Update leads table with funnel tracking fields
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS ebook_downloaded boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS portal_accessed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS reports_downloaded boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS analysis_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS violations_found integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS call_booked boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS source text,
ADD COLUMN IF NOT EXISTS utm_campaign text,
ADD COLUMN IF NOT EXISTS utm_source text,
ADD COLUMN IF NOT EXISTS utm_medium text;

-- Create analysis_results table to store scan results per lead
CREATE TABLE public.analysis_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  results_json jsonb NOT NULL,
  violations_count integer DEFAULT 0,
  damages_potential numeric(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analysis_results
ALTER TABLE public.analysis_results ENABLE ROW LEVEL SECURITY;

-- RLS policies for analysis_results (service role only access like leads table)
CREATE POLICY "deny_anon_access_results" 
ON public.analysis_results 
AS RESTRICTIVE
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

CREATE POLICY "deny_authenticated_access_results" 
ON public.analysis_results 
AS RESTRICTIVE
FOR ALL 
TO authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "service_role_full_access_results" 
ON public.analysis_results 
AS RESTRICTIVE
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_analysis_results_lead_id ON public.analysis_results(lead_id);