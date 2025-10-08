-- BEAUTY LEADS TABLE SETUP - Run this in Supabase SQL Editor
-- This creates the beauty_leads table for the beauty sales page

-- Create the beauty_leads table
CREATE TABLE IF NOT EXISTS beauty_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100), 
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DISABLE Row Level Security (this often causes issues)
ALTER TABLE beauty_leads DISABLE ROW LEVEL SECURITY;

-- Give service role full access
GRANT ALL PRIVILEGES ON beauty_leads TO service_role;
GRANT ALL PRIVILEGES ON SEQUENCE beauty_leads_id_seq TO service_role;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_beauty_leads_email ON beauty_leads(email);
CREATE INDEX IF NOT EXISTS idx_beauty_leads_created_at ON beauty_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_beauty_leads_utm_source ON beauty_leads(utm_source);

-- Test insert to make sure it works
INSERT INTO beauty_leads (email, first_name, utm_source) 
VALUES ('beauty-test@example.com', 'Beauty Test User', 'test')
ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT * FROM beauty_leads LIMIT 1;