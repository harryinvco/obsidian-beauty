-- Create table for Fashion lead magnet page leads
CREATE TABLE IF NOT EXISTS fashion_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL,
    ad_spend VARCHAR(50) NOT NULL,
    monthly_revenue VARCHAR(50) NOT NULL,
    growth_challenge VARCHAR(100) NOT NULL,
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
CREATE UNIQUE INDEX fashion_leads_email_idx ON fashion_leads(LOWER(email));

-- Add RLS (Row Level Security) policies
ALTER TABLE fashion_leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows the service role to insert
CREATE POLICY "Service role can insert fashion leads" ON fashion_leads
    FOR INSERT
    TO service_role
    WITH CHECK (true);

-- Create a policy that allows the service role to select
CREATE POLICY "Service role can select fashion leads" ON fashion_leads
    FOR SELECT
    TO service_role
    USING (true);

-- Create a policy that allows the service role to update
CREATE POLICY "Service role can update fashion leads" ON fashion_leads
    FOR UPDATE
    TO service_role
    USING (true);

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to fashion_leads table
CREATE TRIGGER update_fashion_leads_updated_at 
    BEFORE UPDATE ON fashion_leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();