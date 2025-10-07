const { createClient } = require('@supabase/supabase-js');

// Load environment variables
const SUPABASE_URL = 'https://legzoryphvodcovbzxpb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ3pvcnlwaHZvZGNvdmJ6eHBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODc3MzU1OSwiZXhwIjoyMDc0MzQ5NTU5fQ.aNUAFVZWU48j-LXLsEK8oJlX07xG-a7ETsexyYIh94M';

async function testConnection() {
    console.log('🔍 Testing Supabase connection...');
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    try {
        // Test simple query
        const { data, error } = await supabase
            .from('ecom_leads')
            .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
            console.log('❌ Error:', error);
            console.log('📋 This is expected if table doesn\'t exist yet');
        } else {
            console.log('✅ Table exists!');
            console.log('📊 Current leads:', data?.[0]?.count || 0);
        }
        
    } catch (err) {
        console.log('❌ Connection error:', err.message);
    }
}

testConnection();