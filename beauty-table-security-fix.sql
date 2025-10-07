-- SECURITY FIX: Proper RLS setup for beauty_leads table
-- Run this in Supabase SQL Editor to secure the data

-- 1. First, let's remove the overly permissive policy
DROP POLICY IF EXISTS "service_role_beauty_leads_policy" ON beauty_leads;

-- 2. Create a more restrictive policy that only allows service_role access
-- This ensures only your Netlify functions can access the data, not public users
CREATE POLICY "beauty_leads_service_role_only" 
ON beauty_leads 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 3. Ensure no public access policy exists
DROP POLICY IF EXISTS "beauty_leads_public_access" ON beauty_leads;

-- 4. Verify RLS is enabled (it should be already)
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'beauty_leads';

-- 5. Check current policies (should only show service_role policy)
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'beauty_leads';

-- 6. Test that public cannot access data (this should return no rows when run as anon user)
-- You can test this by switching to "anon" role in Supabase dashboard
-- SELECT * FROM beauty_leads; -- This should fail for anon users

-- 7. Revoke any unnecessary public permissions
REVOKE ALL ON beauty_leads FROM PUBLIC;
REVOKE ALL ON beauty_leads FROM anon;
REVOKE ALL ON beauty_leads FROM authenticated;

-- 8. Confirm only service_role has access
SELECT 
    table_name,
    privilege_type,
    grantee
FROM information_schema.table_privileges 
WHERE table_name = 'beauty_leads'
ORDER BY grantee;

SELECT 'Security fix applied - only service_role can access beauty_leads' as status;