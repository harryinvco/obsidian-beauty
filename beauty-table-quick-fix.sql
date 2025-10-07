-- QUICK FIX: Run this first to check and fix existing tables
-- Execute each section separately in Supabase SQL Editor

-- 1. Check what tables exist with 'lead' in the name
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%lead%';

-- 2. If you see 'bauty_leads' or similar misspelled table, run this to rename it:
-- ALTER TABLE bauty_leads RENAME TO beauty_leads;

-- 3. Create the beauty_leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS beauty_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create index for performance
CREATE INDEX IF NOT EXISTS idx_beauty_leads_email ON beauty_leads(email);

-- 5. Set up RLS policy for service role (since you enabled RLS)
DROP POLICY IF EXISTS "service_role_beauty_leads_policy" ON beauty_leads;

CREATE POLICY "service_role_beauty_leads_policy" 
ON beauty_leads 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 6. Grant necessary permissions to service role
GRANT ALL ON beauty_leads TO service_role;
GRANT USAGE, SELECT ON SEQUENCE beauty_leads_id_seq TO service_role;

-- 7. Test the table access
-- INSERT INTO beauty_leads (email, first_name) VALUES ('test@example.com', 'Test User');
-- SELECT * FROM beauty_leads WHERE email = 'test@example.com';
-- DELETE FROM beauty_leads WHERE email = 'test@example.com';