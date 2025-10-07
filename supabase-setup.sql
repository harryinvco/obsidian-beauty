-- Supabase Database Structure for Obsidian Sales Pages
-- Execute these commands in your Supabase SQL editor

-- First, let's check what tables currently exist
-- Run this to see existing tables:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%lead%';

-- If you have a misspelled table (like 'bauty_leads'), you can rename it:
-- ALTER TABLE IF EXISTS bauty_leads RENAME TO beauty_leads;

-- Beauty leads table (ACTIVE)
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

-- SaaS leads table (PLACEHOLDER - ready for activation)
CREATE TABLE IF NOT EXISTS saas_leads (
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

-- Ecommerce checklist leads table (PLACEHOLDER - ready for activation)
CREATE TABLE IF NOT EXISTS ecom_leads (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    landing_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_beauty_leads_email ON beauty_leads(email);
CREATE INDEX IF NOT EXISTS idx_beauty_leads_created_at ON beauty_leads(created_at);

CREATE INDEX IF NOT EXISTS idx_saas_leads_email ON saas_leads(email);
CREATE INDEX IF NOT EXISTS idx_saas_leads_created_at ON saas_leads(created_at);

CREATE INDEX IF NOT EXISTS idx_ecom_leads_email ON ecom_leads(email);
CREATE INDEX IF NOT EXISTS idx_ecom_leads_created_at ON ecom_leads(created_at);

-- Enable Row Level Security (RLS) - IMPORTANT: You've already enabled this
-- If RLS is already enabled, you can skip these ALTER statements

-- ALTER TABLE beauty_leads ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE saas_leads ENABLE ROW LEVEL SECURITY; 
-- ALTER TABLE ecom_leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow service role full access to beauty_leads" ON beauty_leads;
DROP POLICY IF EXISTS "Allow service role full access to saas_leads" ON saas_leads;
DROP POLICY IF EXISTS "Allow service role full access to ecom_leads" ON ecom_leads;

-- Create policies for service role access
-- These policies allow the service role (used by Netlify functions) full access
CREATE POLICY "service_role_beauty_leads_policy" 
ON beauty_leads 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "service_role_saas_leads_policy" 
ON saas_leads 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

CREATE POLICY "service_role_ecom_leads_policy" 
ON ecom_leads 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);