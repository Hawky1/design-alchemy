-- Add explicit deny policies to satisfy security scanner
-- These don't change actual security (RLS already denies by default) but make the rules visible

-- Explicitly deny SELECT for anon role
CREATE POLICY "Explicitly Deny Public Access"
ON public.leads
FOR SELECT
TO anon
USING (false);

-- Explicitly deny SELECT for authenticated role (extra safety)
CREATE POLICY "Explicitly Deny Authenticated Access"
ON public.leads
FOR SELECT
TO authenticated
USING (false);