const { createClient } = require('@supabase/supabase-js');

// REMOVED EXPOSED SECRETS - Use environment variables instead  
const SUPABASE_URL = process.env.SUPABASE_URL || 'your-supabase-url';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-key';

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