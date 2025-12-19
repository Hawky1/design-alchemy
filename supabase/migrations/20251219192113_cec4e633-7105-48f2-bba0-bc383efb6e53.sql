-- Ensure RLS is enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (prevents bypassing RLS)
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;

-- Drop ALL existing policies on leads table
DROP POLICY IF EXISTS "Enable Service Role Access" ON public.leads;
DROP POLICY IF EXISTS "Deny all public access" ON public.leads;

-- Create single policy granting access ONLY to service_role
-- anon and authenticated will have NO access (no policy = no access when RLS is enabled)
CREATE POLICY "Allow Service Role Full Access"
ON public.leads
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);