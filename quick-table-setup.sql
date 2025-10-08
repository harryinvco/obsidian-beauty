-- Quick table creation for ecom_leads
CREATE TABLE IF NOT EXISTS ecom_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100),
    website VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_path VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMPORTANT: Disable RLS temporarily for testing
ALTER TABLE ecom_leads DISABLE ROW LEVEL SECURITY;

-- Grant permissions to service role
GRANT ALL ON ecom_leads TO service_role;
GRANT USAGE ON SEQUENCE ecom_leads_id_seq TO service_role;