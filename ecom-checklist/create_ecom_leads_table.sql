-- Create ecom_leads table for storing ecommerce checklist leads
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

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_ecom_leads_email ON ecom_leads(email);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_ecom_leads_created_at ON ecom_leads(created_at);

-- Create index on utm_source for marketing attribution
CREATE INDEX IF NOT EXISTS idx_ecom_leads_utm_source ON ecom_leads(utm_source);

-- Enable Row Level Security (RLS)
ALTER TABLE ecom_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to manage all data
CREATE POLICY "Service role can manage ecom leads" ON ecom_leads
    FOR ALL USING (auth.role() = 'service_role');

-- Create policy to allow authenticated users to read their own data (if needed for dashboard)
CREATE POLICY "Users can read own ecom leads" ON ecom_leads
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ecom_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER ecom_leads_updated_at_trigger
    BEFORE UPDATE ON ecom_leads
    FOR EACH ROW
    EXECUTE FUNCTION update_ecom_leads_updated_at();

-- Insert some sample data for testing (optional)
/*
INSERT INTO ecom_leads (email, first_name, website, utm_source, utm_medium, utm_campaign) VALUES 
('test@example.com', 'John', 'johnstore.com', 'google', 'cpc', 'ecom-checklist'),
('demo@test.com', 'Jane', 'janestore.com', 'facebook', 'social', 'ecom-checklist');
*/

-- Grant necessary permissions
GRANT ALL ON ecom_leads TO service_role;
GRANT USAGE ON SEQUENCE ecom_leads_id_seq TO service_role;

-- Create view for analytics (optional)
CREATE VIEW ecom_leads_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as signup_date,
    COUNT(*) as daily_signups,
    utm_source,
    utm_medium,
    utm_campaign
FROM ecom_leads 
GROUP BY DATE_TRUNC('day', created_at), utm_source, utm_medium, utm_campaign
ORDER BY signup_date DESC;

GRANT SELECT ON ecom_leads_analytics TO service_role;