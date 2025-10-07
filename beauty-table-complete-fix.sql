-- FIXED: Complete beauty_leads table setup with proper sequence handling
-- Run this in Supabase SQL Editor

-- 1. Drop table if it exists (to start fresh)
DROP TABLE IF EXISTS beauty_leads CASCADE;

-- 2. Create the table with proper SERIAL (which auto-creates the sequence)
CREATE TABLE beauty_leads (
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

-- 3. Create index for performance
CREATE INDEX idx_beauty_leads_email ON beauty_leads(email);
CREATE INDEX idx_beauty_leads_created_at ON beauty_leads(created_at);

-- 4. Grant permissions to service_role (this will work with any sequence name)
GRANT ALL PRIVILEGES ON TABLE beauty_leads TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 5. Since RLS is enabled, create the policy
DROP POLICY IF EXISTS "service_role_beauty_leads_policy" ON beauty_leads;

CREATE POLICY "service_role_beauty_leads_policy" 
ON beauty_leads 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 6. Test the setup
INSERT INTO beauty_leads (email, first_name) VALUES ('test@example.com', 'Test User');
SELECT * FROM beauty_leads WHERE email = 'test@example.com';

-- 7. Verify the sequence exists and works
SELECT currval(pg_get_serial_sequence('beauty_leads', 'id'));

-- 8. Clean up test data
DELETE FROM beauty_leads WHERE email = 'test@example.com';

-- Success message
SELECT 'beauty_leads table setup complete!' as status;