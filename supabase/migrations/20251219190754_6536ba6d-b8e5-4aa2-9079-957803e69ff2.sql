-- Create restrictive policy that denies all access
-- Service role bypasses RLS, so it will still have full access
CREATE POLICY "Deny all public access"
ON public.leads
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);