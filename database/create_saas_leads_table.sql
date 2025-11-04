-- Create table for SaaS lead magnet page leads
CREATE TABLE IF NOT EXISTS saas_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    ad_spend VARCHAR(50),
    utm_source VARCHAR(255),
    utm_medium VARCHAR(255),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    landing_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on email for this table
CREATE UNIQUE INDEX saas_leads_email_idx ON saas_leads(LOWER(email));

-- Add RLS (Row Level Security) policies
ALTER TABLE saas_leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows the service role to insert
CREATE POLICY "Service role can insert saas leads" ON saas_leads
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create a policy that allows the service role to select
CREATE POLICY "Service role can select saas leads" ON saas_leads
    FOR SELECT
    TO service_role
    USING (true);

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saas_leads_updated_at
    BEFORE UPDATE ON saas_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment to the table
COMMENT ON TABLE saas_leads IS 'Leads from the SaaS B2B lead magnet sales page';
COMMENT ON COLUMN saas_leads.website IS 'Company website URL';
COMMENT ON COLUMN saas_leads.ad_spend IS 'Monthly ad spend budget range';