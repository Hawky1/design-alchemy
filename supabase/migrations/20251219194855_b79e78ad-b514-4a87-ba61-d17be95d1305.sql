-- Add ip_address column to leads table for rate limiting
ALTER TABLE public.leads ADD COLUMN ip_address text;