-- 1. Force Enable RLS (ensure it's active)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 2. Force RLS for table owner as well
ALTER TABLE public.leads FORCE ROW LEVEL SECURITY;

-- 3. Revoke all base permissions from public roles
REVOKE ALL ON public.leads FROM anon;
REVOKE ALL ON public.leads FROM authenticated;
REVOKE ALL ON public.leads FROM public;

-- 4. Drop ALL existing policies on leads table
DROP POLICY IF EXISTS "Allow Service Role Full Access" ON public.leads;
DROP POLICY IF EXISTS "Explicitly Deny Authenticated Access" ON public.leads;
DROP POLICY IF EXISTS "Explicitly Deny Public Access" ON public.leads;
DROP POLICY IF EXISTS "Allow insert for service role" ON public.leads;
DROP POLICY IF EXISTS "service_role_full_access" ON public.leads;
DROP POLICY IF EXISTS "deny_anon_access" ON public.leads;
DROP POLICY IF EXISTS "deny_authenticated_access" ON public.leads;

-- 5. Create Policy for service_role full access (service_role bypasses RLS by default, but explicit is safer)
CREATE POLICY "service_role_full_access" 
ON public.leads 
FOR ALL 
TO service_role
USING (true) 
WITH CHECK (true);

-- 6. Create explicit DENY policy for anon role (restrictive)
CREATE POLICY "deny_anon_access" 
ON public.leads 
AS RESTRICTIVE
FOR ALL 
TO anon
USING (false)
WITH CHECK (false);

-- 7. Create explicit DENY policy for authenticated role (restrictive)
CREATE POLICY "deny_authenticated_access" 
ON public.leads 
AS RESTRICTIVE
FOR ALL 
TO authenticated
USING (false)
WITH CHECK (false);