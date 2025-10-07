// Quick Supabase Table Setup
// This script will create the ecom_leads table in your existing Supabase project

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function createTable() {
    console.log('🚀 Setting up ecom_leads table in Supabase...\n');
    
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || 
        SUPABASE_URL.includes('your-project') || 
        SUPABASE_SERVICE_ROLE_KEY.includes('your-service')) {
        console.log('❌ Please update your .env file with actual Supabase credentials:');
        console.log('SUPABASE_URL=https://your-actual-project-id.supabase.co');
        console.log('SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key');
        return;
    }
    
    console.log('✅ Supabase credentials found');
    console.log(`🔗 Project URL: ${SUPABASE_URL}`);
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    try {
        console.log('🔍 Checking if table already exists...');
        
        // Check if table exists
        const { data, error } = await supabase
            .from('ecom_leads')
            .select('count(*)', { count: 'exact', head: true });
            
        if (!error) {
            console.log('✅ Table "ecom_leads" already exists!');
            console.log(`📊 Current leads: ${data?.[0]?.count || 0}`);
            console.log('\n🎉 Your system is ready to capture leads!');
            return;
        }
        
        if (error.message.includes('does not exist')) {
            console.log('📋 Table does not exist. Creating it now...');
            console.log('\n⚠️  Since we cannot execute DDL commands via the JS client,');
            console.log('please copy and run this SQL in your Supabase SQL Editor:');
            console.log('\n' + '='.repeat(60));
            console.log(`
-- Create ecom_leads table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ecom_leads_email ON ecom_leads(email);
CREATE INDEX IF NOT EXISTS idx_ecom_leads_created_at ON ecom_leads(created_at);
CREATE INDEX IF NOT EXISTS idx_ecom_leads_utm_source ON ecom_leads(utm_source);

-- Enable RLS
ALTER TABLE ecom_leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can manage ecom leads" ON ecom_leads
    FOR ALL USING (auth.role() = 'service_role');
`);
            console.log('='.repeat(60));
            console.log('\n📋 Steps:');
            console.log('1. Go to your Supabase dashboard');
            console.log('2. Click on "SQL Editor"');
            console.log('3. Paste the SQL above');
            console.log('4. Click "Run"');
            console.log('5. Run this script again to verify');
            
        } else {
            console.error('❌ Unexpected error:', error.message);
        }
        
    } catch (err) {
        console.error('❌ Connection error:', err.message);
        console.log('\n💡 Make sure your Supabase credentials are correct in .env file');
    }
}

createTable().catch(console.error);