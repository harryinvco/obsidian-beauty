-- SIMPLE TABLE SETUP - Run this in Supabase SQL Editor
-- This creates the table with no complex permissions that might cause issues

-- Create the table
CREATE TABLE IF NOT EXISTS ecom_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    website VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100), 
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_path VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE Row Level Security (this often causes issues)
ALTER TABLE ecom_leads DISABLE ROW LEVEL SECURITY;

-- Give service role full access
GRANT ALL PRIVILEGES ON ecom_leads TO service_role;
GRANT ALL PRIVILEGES ON SEQUENCE ecom_leads_id_seq TO service_role;

-- Test insert to make sure it works
INSERT INTO ecom_leads (email, first_name, website) 
VALUES ('test@example.com', 'Test User', 'example.com')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT * FROM ecom_leads LIMIT 1;